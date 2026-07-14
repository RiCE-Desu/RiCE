import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Photography() {
  const [carouselPhotos, setCarouselPhotos] = useState([]);
  const [gridPhotos, setGridPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // State buat Modal

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('photos_metadata')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      // Pisah foto buat carousel (max 5) dan sisanya buat grid
      setCarouselPhotos(data.filter(p => p.is_carousel).slice(0, 5));
      setGridPhotos(data.filter(p => !p.is_carousel));
    }
    setLoading(false);
  };

  // Helper buat format tanggal
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8 font-sans selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center border-4 border-black p-6 mb-12 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Photography // Archive</h1>
          <Link to="/" className="border-2 border-black px-6 py-2 font-mono font-black uppercase hover:bg-black hover:text-white transition-all">Back</Link>
        </div>

        {/* SECTION 1: TOP 5 BEST SHOTS (Carousel-ish) */}
        <div className="mb-16">
          <h2 className="font-mono text-xs font-bold mb-4 bg-black text-white w-max px-2 py-1 uppercase tracking-widest">● Selected_Shots.exe</h2>
          <div className="flex overflow-x-auto gap-6 pb-6 snap-x no-scrollbar">
            {carouselPhotos.map((photo, index) => {
              const { data } = supabase.storage.from('photos').getPublicUrl(photo.storage_path);
              return (
                <div key={photo.id} className="snap-center shrink-0 w-[300px] md:w-[450px] border-4 border-black p-4 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative">
                  <div className="absolute top-8 left-8 bg-black text-white px-3 py-1 font-mono text-[10px] z-10">FRAME // {index + 1}</div>
                  <div className="aspect-[3/4] border-2 border-black overflow-hidden mb-4 bg-gray-100">
                    <img src={data.publicUrl} alt={photo.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="border-t-2 border-black pt-4">
                    <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">// SHOT DATA</p>
                    <h3 className="text-xl font-black uppercase truncate">{photo.title}</h3>
                    <div className="mt-4 bg-black text-white p-2 flex items-center justify-between">
                       <span className="text-[10px] font-mono">LOGGED: {formatDate(photo.created_at)}</span>
                       <button onClick={() => setSelectedPhoto(photo)} className="text-[10px] font-bold underline cursor-pointer">DETAILS</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: SHOWCASE (Pinterest Style Grid) */}
        <div className="mb-20">
          <h2 className="font-mono text-xs font-bold mb-8 border-b-4 border-black pb-2 uppercase tracking-widest">● All_Archives.lib</h2>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {gridPhotos.map((photo) => {
              const { data } = supabase.storage.from('photos').getPublicUrl(photo.storage_path);
              return (
                <div 
                  key={photo.id} 
                  onClick={() => setSelectedPhoto(photo)}
                  className="relative group cursor-pointer border-2 border-black overflow-hidden break-inside-avoid shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  <img src={data.publicUrl} alt={photo.title} className="w-full h-auto block" />
                  
                  {/* Pinterest Hover Info */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                    <h4 className="font-black uppercase text-sm leading-tight">{photo.title}</h4>
                    <p className="font-mono text-[9px] mt-1">{formatDate(photo.created_at)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- MODAL POP UP (THE "WAH" ANIMATION) --- */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Overlay Gelap */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-500"
            onClick={() => setSelectedPhoto(null)}
          ></div>
          
          {/* Box Modal */}
          <div className="relative bg-white border-8 border-black w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
            
            {/* Tombol Back Modal */}
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 bg-red-600 text-white border-2 border-black px-4 py-1 font-black uppercase hover:bg-black transition-colors"
            >
              CLOSE [X]
            </button>

            {/* Gambar di Modal */}
            <div className="md:w-2/3 bg-gray-100 flex items-center justify-center p-2 border-b-8 md:border-b-0 md:border-r-8 border-black">
              {(() => {
                const { data } = supabase.storage.from('photos').getPublicUrl(selectedPhoto.storage_path);
                return <img src={data.publicUrl} alt="Preview" className="max-w-full h-auto object-contain shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]" />;
              })()}
            </div>

            {/* Info di Modal */}
            <div className="md:w-1/3 p-8 flex flex-col justify-center">
              <span className="font-mono text-xs text-gray-500 uppercase font-bold tracking-[0.2em]">Metadata_Report</span>
              <h2 className="text-4xl font-black uppercase leading-none my-4 tracking-tighter italic">{selectedPhoto.title}</h2>
              
              <div className="border-y-4 border-black py-4 my-4">
                <p className="text-xs font-mono font-bold uppercase mb-2 text-red-600">// Upload_Date</p>
                <p className="text-sm font-black">{formatDate(selectedPhoto.created_at)}</p>
              </div>

              <div>
                <p className="text-xs font-mono font-bold uppercase mb-2 text-red-600">// Analysis_Caption</p>
                <p className="text-sm leading-relaxed font-medium text-gray-800 whitespace-pre-line">
                  {selectedPhoto.caption || "No data transmission logged for this visual."}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t-2 border-dashed border-black">
                <p className="font-mono text-[9px] uppercase animate-pulse">Status: Success_Retrieved // Format: Comic_Lab_v2</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}