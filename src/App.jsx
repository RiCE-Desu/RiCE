import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Achievements from './pages/Achievements'; 
import WebWorks from './pages/WebWorks';       
import Photography from './pages/Photography'; // 📷 Import halaman Photography
import Contact from './pages/Contact';         // ✉️ TAMBAHAN: Import halaman Contact / Say Hi!
import AdminDashboard from './pages/AdminDashboard';
import BlogList from './pages/BlogList';
import SongList from './pages/SongList';
import { supabase } from './supabaseClient';

// --- KOMPONEN ANIMASI KUCING PINTAR (STATE MACHINE GAME STYLE) ---
function PetFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isFacingLeft, setIsFacingLeft] = useState(false);
  const [catState, setCatState] = useState('sit'); 
  
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });
  const idleTimeoutId = useRef(null);
  const stretchTimeoutId = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now();
      const dt = now - lastMousePos.current.time;
      
      let velocity = 0;
      if (dt > 0) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        velocity = distance / dt;
      }

      setPosition((prev) => {
        if (e.clientX < prev.x) setIsFacingLeft(true);
        if (e.clientX > prev.x) setIsFacingLeft(false);
        return { x: e.clientX, y: e.clientY };
      });

      const isAtEdge = 
        e.clientX <= 15 || 
        e.clientY <= 15 || 
        e.clientX >= window.innerWidth - 15 || 
        window.innerHeight - e.clientY <= 15;

      clearTimeout(idleTimeoutId.current);
      clearTimeout(stretchTimeoutId.current);

      if (isAtEdge) {
        setCatState('sit');
      } else {
        if (velocity > 0.7) {
          setCatState('run');
        } else {
          setCatState('walk');
        }

        idleTimeoutId.current = setTimeout(() => {
          setCatState('sit'); 
          
          stretchTimeoutId.current = setTimeout(() => {
            setCatState('stretching');
          }, 5000);

        }, 150);
      }

      lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(idleTimeoutId.current);
      clearTimeout(stretchTimeoutId.current);
    };
  }, []);

  const getSpriteImage = () => {
    switch (catState) {
      case 'walk': return '/Cat-2-Walk.png';
      case 'run': return '/Cat-2-Run.png';
      case 'stretching': return '/Cat-2-Stretching.png';
      case 'sit':
      default: return '/Cat-2-Sitting.png';
    }
  };

  const getAnimationClass = () => {
    switch (catState) {
      case 'walk': return 'animate-cat-walk';
      case 'run': return 'animate-cat-run';
      case 'stretching': return 'animate-cat-stretch';
      case 'sit':
      default: return 'animate-cat-sit';
    }
  };

  return (
    // DI SINI PERUBAHANNYA: Menambahkan class 'hidden md:block'
    <div
      className="fixed pointer-events-none z-50 select-none hidden md:block"
      style={{
        left: `${position.x}px`,
        top: `${position.y + 35}px`, 
        transform: `translate(-50%, -50%) scaleX(${isFacingLeft ? -1 : 1})`,
        transition: 'left 0.12s ease-out, top 0.12s ease-out',
      }}
    >
      <div 
        className={`bg-no-repeat ${getAnimationClass()}`}
        style={{
          backgroundImage: `url(${getSpriteImage()})`,
          imageRendering: 'pixelated',
          backgroundSize: 'auto 100%', 
        }}
      />
    </div>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const [songsPool, setSongsPool] = useState([]);      
  const [shuffleQueue, setShuffleQueue] = useState([]);  
  const [currentTrack, setCurrentTrack] = useState(null); 
  const [globalAudio, setGlobalAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data } = await supabase.from('songs_metadata').select('*');
      if (data && data.length > 0) {
        setSongsPool(data);

        const featured = data.find(s => s.is_featured);
        const startingTrack = featured || data[Math.floor(Math.random() * data.length)];
        setCurrentTrack(startingTrack);

        const { data: { publicUrl } } = supabase.storage.from('songs').getPublicUrl(startingTrack.storage_path);
        const audioObj = new Audio(publicUrl);
        audioObj.loop = false; 
        setGlobalAudio(audioObj);
      }
    };
    fetchInitialData();
  }, []);

  const generateFairShuffleQueue = (pool, excludeId) => {
    let filteredPool = pool.filter(track => track.id !== excludeId);
    if (filteredPool.length === 0) filteredPool = [...pool];

    for (let i = filteredPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filteredPool[i], filteredPool[j]] = [filteredPool[j], filteredPool[i]];
    }
    return filteredPool;
  };

  const playNextSong = () => {
    if (songsPool.length === 0 || !globalAudio) return;

    let currentQueue = [...shuffleQueue];
    
    if (currentQueue.length === 0) {
      currentQueue = generateFairShuffleQueue(songsPool, currentTrack?.id);
    }

    const nextTrack = currentQueue.shift();
    setShuffleQueue(currentQueue);
    setCurrentTrack(nextTrack);

    const { data: { publicUrl } } = supabase.storage.from('songs').getPublicUrl(nextTrack.storage_path);
    
    globalAudio.pause();
    globalAudio.src = publicUrl;
    globalAudio.load();

    if (isPlaying) {
      globalAudio.play().catch(err => console.log("Safe play next:", err));
    }
  };

  useEffect(() => {
    if (!globalAudio) return;

    const handleSongEnded = () => {
      playNextSong();
    };

    globalAudio.addEventListener('ended', handleSongEnded);
    return () => {
      if (globalAudio) globalAudio.removeEventListener('ended', handleSongEnded);
    };
  }, [globalAudio, shuffleQueue, currentTrack, songsPool, isPlaying]);

  const toggleGlobalPlay = () => {
    if (!globalAudio) return alert("Core audio transmisi belum siap!");
    
    if (isPlaying) {
      globalAudio.pause();
      setIsPlaying(false);
    } else {
      globalAudio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Gagal memutar audio:", err));
    }
  };

  const changeGlobalTrack = async (track) => {
    if (!globalAudio) return;
    
    setCurrentTrack(track);

    const { data: { publicUrl } } = supabase.storage.from('songs').getPublicUrl(track.storage_path);
    globalAudio.pause();
    globalAudio.src = publicUrl;
    globalAudio.load();

    const playPromise = globalAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => setIsPlaying(true)).catch(err => console.log("Track change safe play:", err));
    }

    try {
      await supabase
        .from('songs_metadata')
        .update({ is_featured: false })
        .neq('id', 0);

      await supabase
        .from('songs_metadata')
        .update({ is_featured: true })
        .eq('id', track.id);

      console.log(`Lagu "${track.title}" berhasil di-pin otomatis ke halaman depan.`);
    } catch (dbErr) {
      console.error("Gagal melakukan auto-pin lagu ke database:", dbErr);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage isPlaying={isPlaying} togglePlay={toggleGlobalPlay} audioReady={!!globalAudio} currentTrack={currentTrack} handleSkip={playNextSong} />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/web-works" element={<WebWorks />} />
        
        {/* 📷 Route ke halaman Photography */}
        <Route path="/photography" element={<Photography />} />
        
        {/* ✉️ TAMBAHAN: Route ke halaman Contact / Say Hi! */}
        <Route path="/contact" element={<Contact />} />
        
        <Route path="/blog" element={<BlogList />} />
        <Route path="/songs" element={<SongList currentTrack={currentTrack} isPlaying={isPlaying} toggleGlobalPlay={toggleGlobalPlay} changeGlobalTrack={changeGlobalTrack} queueLength={shuffleQueue.length} />} />
        <Route path="/rais-secret-admin" element={<AdminDashboard />} />
      </Routes>

      <PetFollower />
    </Router>
  );
}