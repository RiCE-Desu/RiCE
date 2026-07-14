import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Achievements() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data: res } = await supabase.from('achievements').select('*').order('event_date', { ascending: false });
      if (res) setData(res);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-12 font-sans selection:bg-black selection:text-white">
      {/* Tombol Back */}
      <Link to="/" className="inline-block border-2 border-black px-4 py-2 font-black uppercase tracking-wider mb-8 hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none">
        ← BACK TO CORE
      </Link>

      <header className="mb-12 border-b-8 border-black pb-6">
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-stroke">
          RECORDS & <br />ACHIEVEMENTS
        </h1>
        <p className="font-mono text-lg mt-2 font-bold">● Milestone history archives data // Rais Portofolio</p>
      </header>

      {/* Bento Grid Layout dengan Animasi CSS Scale-In */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
        {data.map((item, index) => {
          // Bikin variasi ukuran kotak bento secara dinamis biar estetik komik
          const isLarge = index % 4 === 0;
          return (
            <div
              key={item.id}
              className={`border-4 border-black p-4 bg-white flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 group cursor-pointer overflow-hidden ${
                isLarge ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              {/* PERBAIKAN: Menggunakan flex-1 dan h-full agar responsif mengikuti ukuran box bento */}
              <div className="relative flex-1 w-full border-2 border-black overflow-hidden bg-gray-100 min-h-[180px]">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out filter grayscale hover:grayscale-0"
                  />
                ) : (
                  // Fallback kalau image_url di DB ternyata NULL / kosong
                  <div className="w-full h-full flex items-center justify-center font-mono text-xs text-gray-400 bg-gray-200">
                    [ NO IMAGE FOUND ]
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 font-mono text-[10px] md:text-xs font-bold border border-white z-10">
                  {new Date(item.event_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              {/* Bagian Teks di bawah tetap aman */}
              <div className="mt-3 pt-2 border-t-2 border-dashed border-black group-hover:border-solid transition-all">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight group-hover:text-yellow-500 transition-colors truncate">
                  {item.title}
                </h2>
                <p className="text-sm font-mono text-neutral-600 line-clamp-2 mt-1">
                  {item.caption}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}