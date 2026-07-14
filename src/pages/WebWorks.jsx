import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function WebWorks() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Urutan: is_featured (true) ditaruh paling atas, lalu berdasarkan tanggal terbaru
        const { data: res, error } = await supabase
          .from('web_works')
          .select('*')
          .order('is_featured', { ascending: false }) 
          .order('created_at', { ascending: false }); 

        if (error) throw error;
        if (res) setWorks(res);
      } catch (err) {
        console.error("Error loading web_works:", err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getPublicImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/600x400?text=No+Image';
    const { data } = supabase.storage.from('photos').getPublicUrl(path);
    return data?.publicUrl;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-white selection:text-black overflow-x-hidden">
      <Link to="/" className="inline-block border-2 border-white px-4 py-2 font-black uppercase tracking-wider mb-8 bg-white text-black hover:bg-black hover:text-white hover:border-white transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]">
        ← Back to Core
      </Link>

      <header className="mb-16 border-b-4 border-dashed border-white pb-6 flex flex-col md:flex-row justify-between items-baseline">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
          [WEB_DEVELOPMENT_WORKS]
        </h1>
        <p className="font-mono text-neutral-400 font-bold">Total Projects: ({works.length})</p>
      </header>

      {loading ? (
        <div className="text-center font-mono text-xl animate-pulse py-12">// LOADING ARCHIVES...</div>
      ) : works.length === 0 ? (
        <div className="text-center font-mono text-neutral-500 py-12">// NO DEPLOYMENTS FOUND IN DATABASE //</div>
      ) : (
        <div className="flex flex-col gap-12 max-w-5xl mx-auto pb-24">
          {works.map((project, index) => (
            <div
              key={project.id}
              className={`w-full bg-white text-black border-4 ${project.is_featured ? 'border-yellow-400 shadow-[8px_8px_0px_0px_rgba(234,179,8,1)]' : 'border-black shadow-[8px_8px_0px_0px_rgba(163,163,163,1)]'} p-6 flex flex-col md:flex-row gap-6 transform hover:scale-[1.01] transition-transform duration-300 group`}
              style={{ transform: `rotate(${index % 2 === 0 ? '0.5deg' : '-0.5deg'})` }}
            >
              <div className="w-full md:w-1/2 border-4 border-black aspect-video overflow-hidden relative bg-neutral-100">
                <img
                  src={getPublicImageUrl(project.storage_path)}
                  alt={project.title}
                  className="w-full h-full object-cover filter contrast-125 grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Image+Missing'; }}
                />
                {/* Logo Pin Estetik Saja */}
                {project.is_featured && (
                  <div className="absolute top-2 right-2 bg-yellow-400 border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="17" x2="12" y2="22"></line>
                      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                    </svg>
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-3">
                    <span className="font-mono text-xs bg-black text-white px-2 py-0.5 font-bold">
                      PROJECT NO. 0{index + 1}
                    </span>
                    <span className="font-mono font-bold text-sm text-neutral-700">
                      {project.created_at ? new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A'}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                    {project.title}
                  </h2>
                  <p className="font-mono text-sm leading-relaxed text-neutral-800 bg-neutral-50 p-3 border-l-4 border-black">
                    {project.caption}
                  </p>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex gap-1.5 flex-wrap">
                    {project.tech_stack ? (
                      project.tech_stack.split(',').map((tech, i) => (
                        <span key={i} className="text-[10px] font-black border-2 border-black px-2 py-0.5 bg-neutral-100 uppercase">
                          {tech.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] font-black border-2 border-black px-2 py-0.5 bg-neutral-100 uppercase">NO TECH SPECIFIED</span>
                    )}
                  </div>

                  <div className="flex gap-2 min-w-[180px]">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer" className="flex-1 text-center border-2 border-black bg-neutral-200 text-black font-mono font-bold text-xs py-1 hover:bg-black hover:text-white transition-colors">[GIT]</a>
                    )}
                    {project.deploy_url && (
                      <a href={project.deploy_url} target="_blank" rel="noreferrer" className="flex-1 text-center border-2 border-black bg-yellow-400 text-black font-mono font-bold text-xs py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">[LIVE]</a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}