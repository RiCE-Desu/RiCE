import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [songs, setSongs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [webWorks, setWebWorks] = useState([]);

  // Guard Loading State
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingSong, setIsUploadingSong] = useState(false);
  const [isUploadingAchievement, setIsUploadingAchievement] = useState(false);
  const [isUploadingWebWork, setIsUploadingWebWork] = useState(false);

  // Form States (Create)
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');

  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [isCarousel, setIsCarousel] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [audioFile, setAudioFile] = useState(null);

  const [achieveTitle, setAchieveTitle] = useState('');
  const [achieveCaption, setAchieveCaption] = useState('');
  const [achieveDate, setAchieveDate] = useState('');
  const [achieveFile, setAchieveFile] = useState(null);

  // Form States Baru untuk Web Works (Sesuai SQL Baru)
  const [workTitle, setWorkTitle] = useState('');
  const [workCaption, setWorkCaption] = useState('');
  const [workTechStack, setWorkTechStack] = useState('');
  const [workGithubUrl, setWorkGithubUrl] = useState('');
  const [workDeployUrl, setWorkDeployUrl] = useState('');
  const [workFile, setWorkFile] = useState(null);

  // Modal Update States
  const [editingItem, setEditingItem] = useState(null);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [updateCaption, setUpdateCaption] = useState('');
  const [updateIsCarousel, setUpdateIsCarousel] = useState(false);
  const [updateArtist, setUpdateArtist] = useState('');
  const [updateDate, setUpdateDate] = useState('');
  const [updateGithubUrl, setUpdateGithubUrl] = useState('');
  const [updateDeployUrl, setUpdateDeployUrl] = useState('');
  const [updateTechStack, setUpdateTechStack] = useState('');

  // SINKRONISASI DATA AMAN (INDIVIDUAL TRY-CATCH)
  const refreshAllData = async () => {
    try {
      const { data: b, error: bErr } = await supabase.from('blogs').select('*').order('id', { ascending: false });
      if (bErr) throw bErr;
      if (b) setBlogs(b);
    } catch (e) { console.error("Blog fetch error:", e.message) }

    try {
      const { data: p, error: pErr } = await supabase.from('photos_metadata').select('*').order('id', { ascending: false });
      if (pErr) throw pErr;
      if (p) setPhotos(p);
    } catch (e) { console.error("Photos fetch error:", e.message) }

    try {
      const { data: s, error: sErr } = await supabase.from('songs_metadata').select('*').order('id', { ascending: false });
      if (sErr) throw sErr;
      if (s) setSongs(s);
    } catch (e) { console.error("Songs fetch error:", e.message) }

    try {
      const { data: a, error: aErr } = await supabase.from('achievements').select('*').order('id', { ascending: false });
      if (aErr) throw aErr;
      if (a) setAchievements(a);
    } catch (e) { console.error("Achievements fetch error:", e.message) }

    try {
      const { data: w, error: wErr } = await supabase.from('web_works').select('*').order('id', { ascending: false });
      if (wErr) throw wErr;
      if (w) setWebWorks(w);
    } catch (e) { console.error("Web Works fetch error:", e.message) }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // --- OPEN UPDATE MODAL ---
  const openUpdateModal = (type, item) => {
    setEditingItem({ type, ...item });
    setUpdateTitle(item.title || '');
    setUpdateContent(item.content || '');
    setUpdateCaption(item.caption || '');
    setUpdateIsCarousel(item.is_carousel || false);
    setUpdateArtist(item.artist || '');
    setUpdateDate(item.event_date || '');
    setUpdateGithubUrl(item.github_url || '');
    setUpdateDeployUrl(item.deploy_url || '');
    setUpdateTechStack(item.tech_stack || '');
  };

  const closeUpdateModal = () => {
    setEditingItem(null);
  };

  // --- HANDLER UPDATE (ALL CHANNELS) ---
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (editingItem.type === 'blog') {
        const { error } = await supabase
          .from('blogs')
          .update({ title: updateTitle, content: updateContent })
          .eq('id', editingItem.id);
        if (error) throw error;
      }
      else if (editingItem.type === 'photo') {
        const { error } = await supabase
          .from('photos_metadata')
          .update({ title: updateTitle, caption: updateCaption, is_carousel: updateIsCarousel })
          .eq('id', editingItem.id);
        if (error) throw error;
      }
      else if (editingItem.type === 'song') {
        const { error } = await supabase
          .from('songs_metadata')
          .update({ title: updateTitle, artist: updateArtist })
          .eq('id', editingItem.id);
        if (error) throw error;
      }
      else if (editingItem.type === 'achievement') {
        const { error } = await supabase
          .from('achievements')
          .update({ title: updateTitle, caption: updateCaption, event_date: updateDate })
          .eq('id', editingItem.id);
        if (error) throw error;
      }
      else if (editingItem.type === 'web_work') {
        const { error } = await supabase
          .from('web_works')
          .update({
            title: updateTitle,
            caption: updateCaption,
            github_url: updateGithubUrl || null,
            deploy_url: updateDeployUrl || null,
            tech_stack: updateTechStack
          })
          .eq('id', editingItem.id);
        if (error) throw error;
      }

      alert("Data Berhasil Diperbarui!");
      closeUpdateModal();
      refreshAllData();
    } catch (err) {
      alert("Gagal memperbarui data: " + err.message);
    }
  };

  // --- CRUD BLOGS ---
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('blogs').insert([{ title: blogTitle, content: blogContent, is_featured: false }]);
    if (error) return alert(error.message);
    alert("Blog Berhasil Dibuat!");
    setBlogTitle(''); setBlogContent(''); refreshAllData();
  };

  const handlePinBlog = async (id) => {
    await supabase.from('blogs').update({ is_featured: false }).neq('id', 0);
    await supabase.from('blogs').update({ is_featured: true }).eq('id', id);
    refreshAllData();
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm("Hapus blog ini?")) return;
    await supabase.from('blogs').delete().eq('id', id);
    refreshAllData();
  };

  // --- CRUD PHOTOS ---
  const handleCreatePhoto = async (e) => {
    e.preventDefault();
    if (isUploadingPhoto) return;
    if (!photoFile) return alert("Pilih file foto!");

    setIsUploadingPhoto(true);
    const fileExt = photoFile.name.split('.').pop();
    const cleanFileName = `${Date.now()}_photo.${fileExt}`;

    try {
      const { error: upErr } = await supabase.storage.from('photos').upload(cleanFileName, photoFile);
      if (upErr) throw new Error(upErr.message);

      const { error: dbErr } = await supabase.from('photos_metadata').insert([
        { title: photoTitle, caption: photoCaption, storage_path: cleanFileName, is_carousel: isCarousel, is_featured: false }
      ]);
      if (dbErr) throw new Error(dbErr.message);

      alert("Foto Berhasil Masuk!");
      setPhotoTitle(''); setPhotoCaption(''); setIsCarousel(false); setPhotoFile(null);
    } catch (err) {
      alert("Gagal upload: " + err.message);
    } finally {
      setIsUploadingPhoto(false);
      refreshAllData();
    }
  };

  const handlePinPhoto = async (id) => {
    await supabase.from('photos_metadata').update({ is_featured: false }).neq('id', 0);
    await supabase.from('photos_metadata').update({ is_featured: true }).eq('id', id);
    refreshAllData();
  };

  const handleDeletePhoto = async (id, storagePath) => {
    if (!confirm("Hapus foto ini?")) return;
    await supabase.storage.from('photos').remove([storagePath]);
    await supabase.from('photos_metadata').delete().eq('id', id);
    refreshAllData();
  };

  // --- CRUD SONGS ---
  const handleCreateSong = async (e) => {
    e.preventDefault();
    if (isUploadingSong) return;
    if (!audioFile) return alert("Pilih file audio!");

    setIsUploadingSong(true);
    const fileExt = audioFile.name.split('.').pop();
    const cleanFileName = `${Date.now()}_track.${fileExt}`;

    try {
      const { error: upErr } = await supabase.storage.from('songs').upload(cleanFileName, audioFile);
      if (upErr) throw new Error(upErr.message);

      const { error: dbErr } = await supabase.from('songs_metadata').insert([{ title: songTitle, artist: songArtist, storage_path: cleanFileName, is_featured: false }]);
      if (dbErr) throw new Error(dbErr.message);

      alert("Lagu Berhasil Ditambahkan!");
      setSongTitle(''); setSongArtist(''); setAudioFile(null);
    } catch (err) {
      alert("Gagal upload lagu: " + err.message);
    } finally {
      setIsUploadingSong(false);
      refreshAllData();
    }
  };

  const handlePinSong = async (id) => {
    await supabase.from('songs_metadata').update({ is_featured: false }).neq('id', 0);
    await supabase.from('songs_metadata').update({ is_featured: true }).eq('id', id);
    refreshAllData();
  };

  const handleDeleteSong = async (id, storagePath) => {
    if (!confirm("Hapus lagu ini?")) return;
    await supabase.storage.from('songs').remove([storagePath]);
    await supabase.from('songs_metadata').delete().eq('id', id);
    refreshAllData();
  };

  // --- CRUD ACHIEVEMENTS ---
  const handleCreateAchievement = async (e) => {
    e.preventDefault();
    if (isUploadingAchievement) return;
    if (!achieveFile) return alert("Pilih file gambar achievement!");

    setIsUploadingAchievement(true);
    const fileExt = achieveFile.name.split('.').pop();

    const cleanFileName = `achievements/${Date.now()}_achieve.${fileExt}`;

    try {
      const { error: upErr } = await supabase.storage
        .from('photos')
        .upload(cleanFileName, achieveFile);

      if (upErr) throw new Error(upErr.message);

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(cleanFileName);

      const { error: dbErr } = await supabase.from('achievements').insert([
        {
          title: achieveTitle,
          caption: achieveCaption,
          event_date: achieveDate,
          storage_path: cleanFileName,
          image_url: publicUrl,
          is_featured: false
        }
      ]);
      if (dbErr) throw new Error(dbErr.message);

      alert("Achievement Berhasil Ditambahkan!");
      setAchieveTitle(''); setAchieveCaption(''); setAchieveDate(''); setAchieveFile(null);
    } catch (err) {
      alert("Gagal upload achievement: " + err.message);
    } finally {
      setIsUploadingAchievement(false);
      refreshAllData();
    }
  };

  const handlePinAchievement = async (id) => {
    await supabase.from('achievements').update({ is_featured: false }).neq('id', 0);
    await supabase.from('achievements').update({ is_featured: true }).eq('id', id);
    refreshAllData();
  };

  const handleDeleteAchievement = async (id, storagePath) => {
    if (!confirm("Hapus achievement ini?")) return;

    try {
      if (storagePath) {
        const { error: storageErr } = await supabase.storage
          .from('photos')
          .remove([storagePath]);

        if (storageErr) {
          console.error("Gagal hapus file di storage:", storageErr.message);
        }
      }

      const { error: dbErr } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (dbErr) throw new Error(dbErr.message);

      alert("Achievement Berhasil Dihapus!");
    } catch (err) {
      alert("Gagal menghapus data: " + err.message);
    } finally {
      refreshAllData();
    }
  };

  // --- CRUD WEB WORKS ---
  const handleCreateWebWork = async (e) => {
    e.preventDefault();
    if (isUploadingWebWork) return;
    if (!workFile) return alert("Pilih file gambar web work!");

    setIsUploadingWebWork(true);
    const fileExt = workFile.name.split('.').pop();
    const cleanFileName = `${Date.now()}_work.${fileExt}`;

    try {
      const { error: upErr } = await supabase.storage.from('photos').upload(cleanFileName, workFile);
      if (upErr) throw new Error(upErr.message);

      const { error: dbErr } = await supabase.from('web_works').insert([
        {
          title: workTitle,
          caption: workCaption,
          tech_stack: workTechStack,
          storage_path: cleanFileName,
          github_url: workGithubUrl || null,
          deploy_url: workDeployUrl || null,
          is_featured: false // <-- Set default false saat create
        }
      ]);
      if (dbErr) throw new Error(dbErr.message);

      alert("Web Work Berhasil Ditambahkan!");
      setWorkTitle(''); setWorkCaption(''); setWorkTechStack(''); setWorkGithubUrl(''); setWorkDeployUrl(''); setWorkFile(null);
    } catch (err) {
      alert("Gagal upload web work: " + err.message);
    } finally {
      setIsUploadingWebWork(false);
      refreshAllData();
    }
  };

  // MENGAKTIFKAN FITUR PIN WEB WORKS (Multi-Pin Toggle)
  const handlePinWebWork = async (id, isCurrentlyFeatured) => {
    try {
      const { error } = await supabase
        .from('web_works')
        .update({ is_featured: !isCurrentlyFeatured }) // Mengubah kebalikan dari status sekarang
        .eq('id', id);

      if (error) throw error;
      refreshAllData();
    } catch (err) {
      alert("Gagal mengubah status pin: " + err.message);
    }
  };

  const handleDeleteWebWork = async (id, storagePath) => {
    if (!confirm("Hapus web work ini?")) return;
    await supabase.storage.from('photos').remove([storagePath]);
    await supabase.from('web_works').delete().eq('id', id);
    refreshAllData();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans select-none">
      <div className="max-w-[1600px] mx-auto border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

        {/* DASHBOARD HEADER */}
        <div className="bg-black text-white p-4 mb-8 border-2 border-black flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">RAIS CONTROL COMPLEX v3</h1>
            <p className="text-xs font-mono text-gray-400">// INTEGRATED 5-CHANNEL CRUD PANEL</p>
          </div>
          <span className="bg-red-600 px-3 py-1 font-mono font-bold animate-pulse text-xs">● ROOT_ACCESS</span>
        </div>

        {/* 5-COLUMN FLEX/GRID SYSTEM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

          {/* CARD 1: BLOG CHANNEL */}
          <div className="border-4 border-black p-4 bg-white flex flex-col justify-between">
            <div>
              <h2 className="bg-black text-white px-2 py-1 font-black text-sm uppercase inline-block mb-4">📝 BLOG TRANSMISSIONS</h2>
              <form onSubmit={handleCreateBlog} className="space-y-3 text-xs mb-4">
                <input type="text" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} placeholder="Title" className="w-full border-2 border-black p-2 font-bold" required />
                <textarea rows="3" value={blogContent} onChange={(e) => setBlogContent(e.target.value)} placeholder="Content log..." className="w-full border-2 border-black p-2" required />
                <button type="submit" className="w-full bg-black text-white py-2 font-bold border-2 border-black hover:bg-white hover:text-black">PUBLISH LOG</button>
              </form>
            </div>
            <div className="border-t-2 border-black pt-3 space-y-2 max-h-[300px] overflow-y-auto">
              {blogs.map(b => (
                <div key={b.id} className="border border-black p-2 flex justify-between items-center text-xs bg-gray-50">
                  <span className="truncate max-w-[80px] font-bold">{b.title}</span>
                  <div className="flex gap-1">
                    <button onClick={() => handlePinBlog(b.id)} className={`px-1.5 py-0.5 text-[10px] font-bold ${b.is_featured ? 'bg-black text-white' : 'bg-yellow-400'}`}>{b.is_featured ? "📌" : "PIN"}</button>
                    <button onClick={() => openUpdateModal('blog', b)} className="bg-blue-600 text-white px-1.5 py-0.5 text-[10px] font-bold">EDIT</button>
                    <button onClick={() => handleDeleteBlog(b.id)} className="bg-red-600 text-white px-1.5 py-0.5 text-[10px] font-bold">X</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 2: PHOTOS CHANNEL */}
          <div className="border-4 border-black p-4 bg-white flex flex-col justify-between">
            <div>
              <h2 className="bg-black text-white px-2 py-1 font-black text-sm uppercase inline-block mb-4">📷 IMAGE REPOSITORY</h2>
              <form onSubmit={handleCreatePhoto} className="space-y-3 text-xs mb-4">
                <input type="text" value={photoTitle} onChange={(e) => setPhotoTitle(e.target.value)} placeholder="Photo Title" className="w-full border-2 border-black p-2 font-bold" required />
                <textarea rows="2" value={photoCaption} onChange={(e) => setPhotoCaption(e.target.value)} placeholder="Photo Caption..." className="w-full border-2 border-black p-2" required />
                <div className="flex items-center gap-2 py-1">
                  <input type="checkbox" checked={isCarousel} onChange={(e) => setIsCarousel(e.target.checked)} id="carousel" />
                  <label htmlFor="carousel" className="text-[10px] font-bold uppercase cursor-pointer">Masuk Carousel Atas?</label>
                </div>
                <input type="file" key={photoFile ? "loaded" : "empty"} accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0] || null)} className="w-full border-2 border-black p-1.5" required={!photoFile} />
                <button type="submit" disabled={isUploadingPhoto} className="w-full bg-black text-white py-2 font-bold border-2 border-black hover:bg-white hover:text-black disabled:bg-gray-400">
                  {isUploadingPhoto ? "INJECTING CORE..." : "INJECT IMAGE"}
                </button>
              </form>
            </div>
            <div className="border-t-2 border-black pt-3 space-y-2 max-h-[300px] overflow-y-auto">
              {photos.map(p => (
                <div key={p.id} className="border border-black p-2 flex justify-between items-center text-xs bg-gray-50">
                  <span className="truncate max-w-[80px] font-bold">{p.title}</span>
                  <div className="flex gap-1">
                    <button onClick={() => handlePinPhoto(p.id)} className={`px-1.5 py-0.5 text-[10px] font-bold ${p.is_featured ? 'bg-black text-white' : 'bg-yellow-400'}`}>{p.is_featured ? "📌" : "PIN"}</button>
                    <button onClick={() => openUpdateModal('photo', p)} className="bg-blue-600 text-white px-1.5 py-0.5 text-[10px] font-bold">EDIT</button>
                    <button onClick={() => handleDeletePhoto(p.id, p.storage_path)} className="bg-red-600 text-white px-1.5 py-0.5 text-[10px] font-bold">X</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 3: SONGS CHANNEL */}
          <div className="border-4 border-black p-4 bg-white flex flex-col justify-between">
            <div>
              <h2 className="bg-black text-white px-2 py-1 font-black text-sm uppercase inline-block mb-4">🎵 AUDIO WAVE DATA</h2>
              <form onSubmit={handleCreateSong} className="space-y-3 text-xs mb-4">
                <input type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} placeholder="Track Title" className="w-full border-2 border-black p-2 font-bold" required />
                <input type="text" value={songArtist} onChange={(e) => setSongArtist(e.target.value)} placeholder="Artist" className="w-full border-2 border-black p-2" required />
                <input type="file" key={audioFile ? "loaded" : "empty"} accept="audio/*,.lrc" onChange={(e) => setAudioFile(e.target.files[0] || null)} className="w-full border-2 border-black p-1.5" required={!audioFile} />
                <button type="submit" disabled={isUploadingSong} className="w-full bg-black text-white py-2 font-bold border-2 border-black hover:bg-white hover:text-black disabled:bg-gray-400">
                  {isUploadingSong ? "TRANSMITTING WAVE..." : "UPLOAD AUDIO"}
                </button>
              </form>
            </div>
            <div className="border-t-2 border-black pt-3 space-y-2 max-h-[300px] overflow-y-auto">
              {songs.map(s => (
                <div key={s.id} className="border border-black p-2 flex justify-between items-center text-xs bg-gray-50">
                  <span className="truncate max-w-[80px] font-bold">{s.title}</span>
                  <div className="flex gap-1">
                    <button onClick={() => handlePinSong(s.id)} className={`px-1.5 py-0.5 text-[10px] font-bold ${s.is_featured ? 'bg-black text-white' : 'bg-yellow-400'}`}>{s.is_featured ? "📌" : "PIN"}</button>
                    <button onClick={() => openUpdateModal('song', s)} className="bg-blue-600 text-white px-1.5 py-0.5 text-[10px] font-bold">EDIT</button>
                    <button onClick={() => handleDeleteSong(s.id, s.storage_path)} className="bg-red-600 text-white px-1.5 py-0.5 text-[10px] font-bold">X</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 4: ACHIEVEMENTS CHANNEL */}
          <div className="border-4 border-black p-4 bg-white flex flex-col justify-between">
            <div>
              <h2 className="bg-black text-white px-2 py-1 font-black text-sm uppercase inline-block mb-4">🏆 ACHIEVEMENTS LOG</h2>
              <form onSubmit={handleCreateAchievement} className="space-y-3 text-xs mb-4">
                <input type="text" value={achieveTitle} onChange={(e) => setAchieveTitle(e.target.value)} placeholder="Achievement Title" className="w-full border-2 border-black p-2 font-bold" required />
                <textarea rows="2" value={achieveCaption} onChange={(e) => setAchieveCaption(e.target.value)} placeholder="Caption / Description" className="w-full border-2 border-black p-2" required />
                <input type="date" value={achieveDate} onChange={(e) => setAchieveDate(e.target.value)} className="w-full border-2 border-black p-2 font-bold" required />
                <input type="file" key={achieveFile ? "loaded" : "empty"} accept="image/*" onChange={(e) => setAchieveFile(e.target.files[0] || null)} className="w-full border-2 border-black p-1.5" required={!achieveFile} />
                <button type="submit" disabled={isUploadingAchievement} className="w-full bg-black text-white py-2 font-bold border-2 border-black hover:bg-white hover:text-black disabled:bg-gray-400">
                  {isUploadingAchievement ? "STORING RECORD..." : "SAVE ACHIEVEMENT"}
                </button>
              </form>
            </div>
            <div className="border-t-2 border-black pt-3 space-y-2 max-h-[300px] overflow-y-auto">
              {achievements.map(a => (
                <div key={a.id} className="border border-black p-2 flex justify-between items-center text-xs bg-gray-50">
                  <span className="truncate max-w-[80px] font-bold">{a.title}</span>
                  <div className="flex gap-1">
                    <button onClick={() => handlePinAchievement(a.id)} className={`px-1.5 py-0.5 text-[10px] font-bold ${a.is_featured ? 'bg-black text-white' : 'bg-yellow-400'}`}>{a.is_featured ? "📌" : "PIN"}</button>
                    <button onClick={() => openUpdateModal('achievement', a)} className="bg-blue-600 text-white px-1.5 py-0.5 text-[10px] font-bold">EDIT</button>
                    <button onClick={() => handleDeleteAchievement(a.id, a.storage_path)} className="bg-red-600 text-white px-1.5 py-0.5 text-[10px] font-bold">X</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 5: WEB WORKS CHANNEL */}
          <div className="border-4 border-black p-4 bg-white flex flex-col justify-between">
            <div>
              <h2 className="bg-black text-white px-2 py-1 font-black text-sm uppercase inline-block mb-4">💻 WEB WORKS ARCHIVE</h2>
              <form onSubmit={handleCreateWebWork} className="space-y-3 text-xs mb-4">
                <input type="text" value={workTitle} onChange={(e) => setWorkTitle(e.target.value)} placeholder="Project Title" className="w-full border-2 border-black p-2 font-bold" required />
                <textarea rows="2" value={workCaption} onChange={(e) => setWorkCaption(e.target.value)} placeholder="Project Caption" className="w-full border-2 border-black p-2" required />
                <input type="text" value={workTechStack} onChange={(e) => setWorkTechStack(e.target.value)} placeholder="Tech Stack (Pisahkan Koma: React, Node)" className="w-full border-2 border-black p-2" required />
                <input type="url" value={workGithubUrl} onChange={(e) => setWorkGithubUrl(e.target.value)} placeholder="GitHub URL (Opsional)" className="w-full border-2 border-black p-2" />
                <input type="url" value={workDeployUrl} onChange={(e) => setWorkDeployUrl(e.target.value)} placeholder="Live Deploy URL (Opsional)" className="w-full border-2 border-black p-2" />
                <input type="file" key={workFile ? "loaded" : "empty"} accept="image/*" onChange={(e) => setWorkFile(e.target.files[0] || null)} className="w-full border-2 border-black p-1.5" required={!workFile} />
                <button type="submit" disabled={isUploadingWebWork} className="w-full bg-black text-white py-2 font-bold border-2 border-black hover:bg-white hover:text-black disabled:bg-gray-400">
                  {isUploadingWebWork ? "ARCHIVING DEPLOYMENT..." : "SAVE WEB WORK"}
                </button>
              </form>
            </div>
            <div className="border-t-2 border-black pt-3 space-y-2 max-h-[300px] overflow-y-auto">
              {webWorks.map(w => (
                <div key={w.id} className="border border-black p-2 flex justify-between items-center text-xs bg-gray-50">
                  <span className="truncate max-w-[80px] font-bold">{w.title}</span>
                  <div className="flex gap-1">
                    {/* TOMBOL PIN UNTUK WEB WORKS DITAMBAHKAN DI SINI */}
                    <button
                      onClick={() => handlePinWebWork(w.id, w.is_featured)}
                      className={`px-1.5 py-0.5 text-[10px] font-bold ${w.is_featured ? 'bg-black text-white' : 'bg-yellow-400'}`}
                    >
                      {w.is_featured ? "📌" : "PIN"}
                    </button>
                    <button onClick={() => openUpdateModal('web_work', w)} className="bg-blue-600 text-white px-1.5 py-0.5 text-[10px] font-bold">EDIT</button>
                    <button onClick={() => handleDeleteWebWork(w.id, w.storage_path)} className="bg-red-600 text-white px-1.5 py-0.5 text-[10px] font-bold">X</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* --- POP-UP MODAL UPDATE DATA (UNIVERSAL FOR 5 CHANNELS) --- */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeUpdateModal}></div>

          <div className="relative bg-white border-4 border-black p-6 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10">
            <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-4">
              <h3 className="font-black text-base uppercase tracking-tight">
                ⚡ UPDATE_{editingItem.type.toUpperCase()}_LOG
              </h3>
              <button onClick={closeUpdateModal} className="bg-black text-white text-xs font-mono px-2 py-0.5 hover:bg-red-600 font-bold">
                [X]
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase mb-1">Title / Label</label>
                <input type="text" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} className="w-full border-2 border-black p-2 font-bold" required />
              </div>

              {editingItem.type === 'blog' && (
                <div>
                  <label className="block font-bold uppercase mb-1">Content Log</label>
                  <textarea rows="5" value={updateContent} onChange={(e) => setUpdateContent(e.target.value)} className="w-full border-2 border-black p-2" required />
                </div>
              )}

              {editingItem.type === 'photo' && (
                <>
                  <div>
                    <label className="block font-bold uppercase mb-1">Caption / Description</label>
                    <textarea rows="4" value={updateCaption} onChange={(e) => setUpdateCaption(e.target.value)} className="w-full border-2 border-black p-2" required />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={updateIsCarousel} onChange={(e) => setUpdateIsCarousel(e.target.checked)} id="update-carousel" />
                    <label htmlFor="update-carousel" className="font-bold uppercase cursor-pointer">Masuk Carousel Atas?</label>
                  </div>
                </>
              )}

              {editingItem.type === 'song' && (
                <div>
                  <label className="block font-bold uppercase mb-1">Artist</label>
                  <input type="text" value={updateArtist} onChange={(e) => setUpdateArtist(e.target.value)} className="w-full border-2 border-black p-2" required />
                </div>
              )}

              {editingItem.type === 'achievement' && (
                <>
                  <div>
                    <label className="block font-bold uppercase mb-1">Caption / Description</label>
                    <textarea rows="4" value={updateCaption} onChange={(e) => setUpdateCaption(e.target.value)} className="w-full border-2 border-black p-2" required />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Manual Date Records</label>
                    <input type="date" value={updateDate} onChange={(e) => setUpdateDate(e.target.value)} className="w-full border-2 border-black p-2 font-bold" required />
                  </div>
                </>
              )}

              {editingItem.type === 'web_work' && (
                <>
                  <div>
                    <label className="block font-bold uppercase mb-1">Caption / Description</label>
                    <textarea rows="4" value={updateCaption} onChange={(e) => setUpdateCaption(e.target.value)} className="w-full border-2 border-black p-2" required />
                  </div>

                  <div>
                    <label className="block font-bold uppercase mb-1">Tech Stack</label>
                    <input type="text" value={updateTechStack} onChange={(e) => setUpdateTechStack(e.target.value)} className="w-full border-2 border-black p-2" placeholder="Cth: React, Tailwind, Supabase" />
                  </div>

                  <div>
                    <label className="block font-bold uppercase mb-1">GitHub URL</label>
                    <input type="url" value={updateGithubUrl} onChange={(e) => setUpdateGithubUrl(e.target.value)} className="w-full border-2 border-black p-2" placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Live Deploy URL</label>
                    <input type="url" value={updateDeployUrl} onChange={(e) => setUpdateDeployUrl(e.target.value)} className="w-full border-2 border-black p-2" placeholder="https://..." />
                  </div>
                </>
              )}

              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 bg-black text-white py-2 font-bold border-2 border-black hover:bg-white hover:text-black">
                  COMMIT CHANGES
                </button>
                <button type="button" onClick={closeUpdateModal} className="border-2 border-black px-4 py-2 font-bold hover:bg-gray-100">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}