import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const fetchAllBlogs = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('id', { ascending: false }); // Yang paling baru ditulis tetep di atas

      if (data) setBlogs(data);
      setLoading(false);
    };
    fetchAllBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-6 font-sans selection:bg-black selection:text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center border-4 border-black p-4 mb-8 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">VOL. 03: THE ARCHIVES // BLOG</h1>
            <p className="text-xs font-mono text-gray-500 mt-1">* CLICK ANY TITLE TO READ THE ARCHIVE *</p>
          </div>
          <Link to="/" className="border-2 border-black px-4 py-2 font-mono text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            ⬅ BACK
          </Link>
        </div>

        {loading && <p className="text-center font-mono text-sm animate-pulse uppercase font-bold">[ LOADING ARCHIVE TILES... ]</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* DAFTAR JUDUL BLOG (KIRI) */}
          <div className="md:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {blogs.map((blog) => (
              <button
                key={blog.id}
                onClick={() => setSelectedBlog(blog)}
                className={`w-full text-left border-2 border-black p-3 block font-black uppercase text-xs tracking-tight transition-all ${
                  selectedBlog?.id === blog.id 
                    ? 'bg-black text-white translate-x-1' 
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {blog.title}
                {blog.is_featured && <span className="block text-[9px] text-yellow-400 font-mono mt-1">📌 PINNED ON HOME</span>}
              </button>
            ))}
          </div>

          {/* ISI CONTENT BLOG YANG DIPILIH (KANAN) */}
          <div className="md:col-span-2 border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-h-[400px]">
            {selectedBlog ? (
              <div className="space-y-4">
                <span className="font-mono text-[10px] bg-black text-white px-1.5 py-0.5 uppercase">MANUSCRIPT #{selectedBlog.id}</span>
                <h2 className="text-2xl font-black uppercase tracking-tight border-b-2 border-black pb-2">{selectedBlog.title}</h2>
                <p className="text-sm leading-relaxed whitespace-pre-line text-gray-800 font-medium">
                  {selectedBlog.content}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-24 text-gray-400 font-mono text-xs">
                <p>[ SELECT A TRANSMISSION FROM THE LEFT PANEL TO READ ]</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}