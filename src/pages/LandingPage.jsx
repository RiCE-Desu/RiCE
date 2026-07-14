import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Terima props musik dari App.jsx
export default function LandingPage({ isPlaying, togglePlay, audioReady }) {
  const [latestBlog, setLatestBlog] = useState({ title: "Belum ada tulisan", content: "Mulai nulis sesuatu di halaman admin, Is!" });
  const [pinnedPhoto, setPinnedPhoto] = useState(null);
  const [pinnedSong, setPinnedSong] = useState({ title: "Your Uploaded Track", artist: "Continuous Background Audio" });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // 1. Ambil Blog Terbaru
        const { data: blogData } = await supabase
          .from('blogs')
          .select('*')
          .order('id', { ascending: false })
          .limit(1);

        if (blogData && blogData.length > 0) {
          setLatestBlog(blogData[0]);
        }

        // 2. 🛠️ LOCK: Ambil data khusus yang is_featured = true
        const { data: photoData } = await supabase
          .from('photos_metadata')
          .select('*')
          .eq('is_featured', true) // Kunci ke kolom is_featured sesuai dashboard admin lu
          .order('created_at', { ascending: false }) // Jika di dashboard ada beberapa yang true, yang terbaru yang tampil
          .limit(1);

        if (photoData && photoData.length > 0) {
          const { data: { publicUrl } } = supabase.storage
            .from('photos')
            .getPublicUrl(photoData[0].storage_path);

          setPinnedPhoto({ ...photoData[0], url: publicUrl });
        } else {
          // Fallback: ambil foto paling terakhir dimasukkan jika tidak ada yang di-featured sama sekali
          const { data: latestPhoto } = await supabase
            .from('photos_metadata')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);

          if (latestPhoto && latestPhoto.length > 0) {
            const { data: { publicUrl } } = supabase.storage
              .from('photos')
              .getPublicUrl(latestPhoto[0].storage_path);

            setPinnedPhoto({ ...latestPhoto[0], url: publicUrl });
          }
        }

        // 3. Ambil Song Pinned/Featured
        const { data: songData } = await supabase
          .from('songs_metadata')
          .select('*')
          .eq('is_featured', true)
          .limit(1);

        if (songData && songData.length > 0) {
          setPinnedSong(songData[0]);
        }
      } catch (error) {
        console.error("Error fetching landing page data:", error);
      }
    };

    fetchHomeData();
  }, []);

  return (
    // Menggunakan flexbox untuk memosisikan seluruh bento grid tepat di tengah layar monitor secara seimbang
    <div className="min-h-screen w-screen bg-white text-black font-sans p-4 md:p-8 flex items-center justify-center box-border selection:bg-black selection:text-white">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 grid-rows-6 md:grid-rows-3 gap-4 h-auto md:h-[85vh] items-stretch">

        {/* PANEL 1: LOGO & SOSMED */}
        <div className="border-4 border-black p-6 bg-white flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group">
          <div>
            <span className="font-black text-xl tracking-tighter">R-PORTFOLIO //</span>
            <div className="flex gap-2 mt-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="border-2 border-black px-1.5 py-0.5 text-xs font-mono font-bold hover:bg-black hover:text-white transition-colors duration-150">IG</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="border-2 border-black px-1.5 py-0.5 text-xs font-mono font-bold hover:bg-black hover:text-white transition-colors duration-150">GH</a>
            </div>
          </div>
          <p className="font-mono text-xs mt-4 uppercase tracking-widest group-hover:invert group-hover:bg-black transition-all p-1 inline-block w-max">[ ISSUE NO. 01 ]</p>
        </div>

        {/* PANEL 2: HERO TITLE */}
        <div className="border-4 border-black md:col-span-2 md:row-span-2 p-8 bg-white flex flex-col justify-center items-center text-center relative overflow-hidden transform transition-all duration-300 hover:scale-[1.01] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] z-10 group">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 bg-[radial-gradient(circle,_#000_10%,_transparent_11%)] bg-[length:12px_12px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]"></div>
          <div className="relative z-10">
            <p className="font-mono text-sm uppercase tracking-widest mb-2 bg-black text-white px-2 py-1 inline-block transform -rotate-1">*BOOM* WELCOME EARTHLING!</p>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none my-4 filter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-stroke">
              Hi, my name is <span className="bg-black text-white px-3 py-1 inline-block transform rotate-1 transition-transform group-hover:scale-105 duration-200">Rais</span>
            </h1>
            <p className="font-serif italic text-lg text-gray-700 mt-2">"Web Developer & Photographer"</p>
          </div>
        </div>

        {/* PANEL 3: MUSIC PLAYER */}
        <div className="border-4 border-black p-6 bg-white flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[-8px_8px_0px_0px_rgba(0,0,0,1)] relative group/music">
          <div className="border-b-2 border-black pb-2 flex justify-between items-center">
            <span className="font-mono text-xs uppercase font-bold bg-black text-white px-1">LOCAL BEAT</span>
            <Link to="/songs" className="text-[10px] font-mono font-black underline opacity-0 group-hover/music:opacity-100 transition-opacity">JUKEBOX ↗</Link>
          </div>

          <Link to="/songs" className="my-4 flex items-center gap-3 cursor-pointer text-left">
            <div className={`w-12 h-12 border-2 border-black rounded-full flex items-center justify-center bg-black text-white font-bold text-xs shrink-0 ${isPlaying ? 'animate-spin-slow' : ''}`}>★</div>
            <div className="overflow-hidden w-40">
              <h3 className="font-black text-sm uppercase truncate m-0">{audioReady ? pinnedSong.title : "Loading Track..."}</h3>
              <p className="text-xs font-mono text-gray-600 truncate m-0">// {pinnedSong.artist || "Continuous Audio"}</p>
            </div>
          </Link>
          <button onClick={(e) => { e.preventDefault(); togglePlay(); }} className="w-full border-2 border-black py-2 font-mono text-xs uppercase font-black tracking-wider hover:bg-black hover:text-white transition-colors duration-200 relative z-20">
            {isPlaying ? "❚❚ PAUSE" : "▶ PLAY"}
          </button>
        </div>

        {/* PANEL 4: CHAPTERS */}
        <div className="border-4 border-black p-6 bg-white flex flex-col justify-between transform transition-all duration-300 hover:translate-y-1 hover:translate-x-1 hover:shadow-[8px_-8px_0px_0px_rgba(0,0,0,1)]">
          <span className="font-mono text-xs uppercase bg-black text-white px-1 w-max">CHAPTERS</span>
          <nav className="flex flex-col gap-2 mt-4 font-black text-xl uppercase tracking-tight text-left">
            <Link to="/web-works" className="hover:underline hover:translate-x-2 transition-transform duration-150">01. WEB WORKS ↗</Link>
            <Link to="/achievements" className="hover:underline hover:translate-x-2 transition-transform duration-150">02. ACHIEVEMENTS ↗</Link>
            <Link to="/contact" className="hover:underline hover:translate-x-2 transition-transform duration-150">03. SAY HI! ↗</Link>
          </nav>
        </div>

        {/* PANEL 5: LIVE BLOG SECTION */}
        <Link to="/blog" className="border-4 border-black p-6 bg-white flex flex-col justify-between md:col-start-4 md:row-start-2 md:row-span-2 transform transition-all duration-300 hover:translate-y-1 hover:-translate-x-1 hover:shadow-[-8px_-8px_0px_0px_rgba(0,0,0,1)] group text-left cursor-pointer">
          <div className="space-y-3 h-full flex flex-col">
            <span className="font-mono text-xs uppercase border-2 border-black px-1.5 py-0.5 font-bold w-max group-hover:bg-black group-hover:text-white transition-colors">AUTHOR'S BLOG ↗</span>
            <h4 className="font-black uppercase text-md mt-2 underline decoration-wavy tracking-tight m-0">{latestBlog.title}</h4>
            <p className="text-xs font-medium leading-relaxed overflow-y-auto max-h-[160px] pr-1 whitespace-pre-line m-0">
              {latestBlog.content}
            </p>
          </div>
          <div className="mt-4 border-t-2 border-black pt-2 font-mono text-[9px] text-gray-500">// CLICK FOR ALL ARCHIVES</div>
        </Link>

        {/* 📷 PANEL 7: SECTION PHOTOGRAPHY */}
        <Link to="/photography" className="border-4 border-black p-4 bg-white flex flex-col justify-between transform transition-all duration-300 hover:translate-y-1 hover:translate-x-1 hover:shadow-[8px_-8px_0px_0px_rgba(0,0,0,1)] group cursor-pointer text-left md:col-start-3 md:row-start-3">
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-center border-b border-black pb-1 mb-2">
              <span className="font-mono text-[10px] uppercase font-bold bg-black text-white px-1">GALLERY ↗</span>
            </div>
            <div className="border-2 border-black overflow-hidden bg-gray-100 flex-grow max-h-[65px] md:max-h-[85px] mb-2 flex items-center justify-center">
              {pinnedPhoto ? (
                <img src={pinnedPhoto.url} alt={pinnedPhoto.title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300" />
              ) : (
                <div className="font-mono text-[10px] text-gray-400">[ NO PHOTO PINNED ]</div>
              )}
            </div>
            <p className="text-xs font-black uppercase truncate m-0">{pinnedPhoto ? pinnedPhoto.title : "SHOTS LIBRARY"}</p>
          </div>
        </Link>

        {/* PANEL 6: MARQUEE */}
        <div className="border-4 border-black md:col-span-2 p-4 bg-black text-white flex items-center overflow-hidden relative group">
          <div className="flex space-x-8 animate-marquee whitespace-nowrap font-black tracking-widest text-sm uppercase">
            <span>RAIS PORTFOLIO • COMIC STYLE LAB • ALL RIGHTS RESERVED • </span>
            <span>RAIS PORTFOLIO • COMIC STYLE LAB • ALL RIGHTS RESERVED • </span>
          </div>
        </div>

      </div>
    </div>
  );
}