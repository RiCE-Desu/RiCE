import React from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-yellow-400 selection:text-black overflow-x-hidden flex flex-col items-center">
      
      <div className="w-full max-w-6xl">
        {/* Tombol Back */}
        <Link to="/" className="inline-block border-4 border-white px-4 py-2 font-black uppercase tracking-wider mb-8 bg-white text-black hover:bg-black hover:text-white hover:border-white transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]">
          ← Back to Core
        </Link>

        {/* HERO SECTION */}
        <header className="mb-12 text-center md:text-left flex flex-col items-center md:items-start">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white drop-shadow-[4px_4px_0px_rgba(234,179,8,1)] text-center md:text-left">
            Halo, Saya <br /> Rais Fatihul Ihsan 👋
          </h1>
          
          {/* Banner ala Marquee */}
          <div className="inline-block bg-yellow-400 text-black border-4 border-white p-3 transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:rotate-0 transition-transform cursor-default mt-2">
            <p className="font-mono font-bold text-sm md:text-lg uppercase text-center">
              🚀 Web Dev Leveling Up to Game Dev! • 🏫 Mahasiswa President University
            </p>
          </div>
        </header>

        {/* BENTO GRID LAYOUT UNTUK KONTEN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-auto w-full">
          
          {/* KOLOM 1: STATUS KARAKTER */}
          <div className="lg:col-span-2 bg-white text-black border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 transition-transform flex flex-col items-center text-center md:items-start md:text-left">
            <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-2 mb-4 flex items-center justify-center md:justify-start gap-3 w-full">
              <span className="text-4xl">🎮</span> Status Karakter
            </h2>
            <p className="font-mono text-sm md:text-base leading-relaxed font-bold mb-6 text-neutral-800">
              Saat ini saya sedang menempuh perjalanan akademis sebagai <span className="bg-yellow-300 px-1">mahasiswa di President University</span>. Di dunia coding, saya memulai petualangan dari realm <span className="bg-black text-white px-1">Web Development</span>. Namun, karena jiwa gamer saya terus memanggil, sekarang saya memutuskan untuk mengambil side quest besar: berpindah class menjadi <span className="underline decoration-wavy decoration-red-500">Pemula di Dunia Game Development!</span>
              <br /><br />
              Saya sedang menikmati serunya menjinakkan game engine, mengatur physics, dan menyusun logika permainan. Latar belakang web dev membantu saya memahami struktur kode lebih cepat, dan sekarang saatnya menerapkannya untuk membangun dunia game yang interaktif!
            </p>

            {/* List Quest */}
            <div className="bg-gray-100 border-4 border-black p-4 font-mono text-sm w-full max-w-xl mx-auto md:mx-0 text-left">
              <ul className="space-y-3 font-bold text-neutral-700">
                <li className="flex items-start gap-2">
                  <span className="text-lg">🏫</span> 
                  <p><span className="bg-black text-white px-1 uppercase">Institusi:</span> President University</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">🚀</span> 
                  <p><span className="bg-black text-white px-1 uppercase">Level:</span> Junior Game Dev Adventurer</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">🔭</span> 
                  <p><span className="bg-black text-white px-1 uppercase">Project:</span> Sedang utak-atik node dan script Godot!</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">🌱</span> 
                  <p><span className="bg-black text-white px-1 uppercase">Misi Utama:</span> Menyeimbangkan kuliah sambil menguasai pembuatan game dari nol.</p>
                </li>
              </ul>
            </div>
          </div>

          {/* KOLOM 2: INVENTORI SENJATA & SKILL */}
          <div className="bg-black text-white border-4 border-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(234,179,8,1)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
            <div className="w-full">
              <h2 className="text-3xl font-black uppercase border-b-4 border-white pb-2 mb-6 w-full">
                🛠️ Tech Stack
              </h2>
              
              {/* Game Dev Skills */}
              <div className="mb-8">
                <p className="font-mono text-yellow-400 font-bold mb-3 uppercase text-sm">► New Quest (Game Dev)</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="border-2 border-white bg-blue-600 text-white font-black px-3 py-1 text-sm hover:scale-105 transition-transform cursor-default">GODOT ENGINE</span>
                  <span className="border-2 border-white bg-blue-800 text-white font-black px-3 py-1 text-sm hover:scale-105 transition-transform cursor-default">GDSCRIPT</span>
                  <span className="border-2 border-white bg-gray-200 text-black font-black px-3 py-1 text-sm hover:scale-105 transition-transform cursor-default">UNITY</span>
                </div>
              </div>

              {/* Web Dev Skills */}
              <div>
                <p className="font-mono text-yellow-400 font-bold mb-3 uppercase text-sm">► Base Skill (Web & Design)</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="border-2 border-white bg-cyan-400 text-black font-black px-3 py-1 text-sm hover:scale-105 transition-transform cursor-default">REACT</span>
                  <span className="border-2 border-white bg-teal-400 text-black font-black px-3 py-1 text-sm hover:scale-105 transition-transform cursor-default">TAILWIND</span>
                  <span className="border-2 border-white bg-yellow-400 text-black font-black px-3 py-1 text-sm hover:scale-105 transition-transform cursor-default">JAVASCRIPT</span>
                  <span className="border-2 border-white bg-red-500 text-white font-black px-3 py-1 text-sm hover:scale-105 transition-transform cursor-default">UI/UX FIGMA</span>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM 3: COOP MODE (CONTACT/SOSMED) - DESAIN 4 KOTAK BARU */}
          <div className="lg:col-span-3 border-t-8 border-white pt-12 mt-4">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 text-yellow-400">🌐 Coop Mode!</h2>
              <p className="font-mono text-base md:text-lg max-w-2xl mx-auto">
                Sebagai mahasiswa sekaligus pemula di dunia game dev, saya sangat terbuka untuk belajar bareng, ikutan Game Jam, proyek kelompok, atau sekadar diskusi santai. <span className="bg-white text-black px-2 font-bold">Let's connect and level up together!</span>
              </p>
            </div>
            
            {/* Grid 4 Tombol Sosmed (Horizontal Layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mx-auto">
              
              {/* WhatsApp */}
              <a href="https://wa.me/6285174112106" target="_blank" rel="noreferrer" className="group flex items-center justify-center gap-3 bg-[#25D366] text-black border-4 border-white p-4 font-black uppercase text-lg shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-12 transition-transform">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                WhatsApp
              </a>
              
              {/* Instagram */}
              <a href="https://instagram.com/is.rice" target="_blank" rel="noreferrer" className="group flex items-center justify-center gap-3 bg-[#E1306C] text-white border-4 border-white p-4 font-black uppercase text-lg shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-12 transition-transform">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                Instagram
              </a>

              {/* Email */}
              <a href="mailto:rice12415@gmail.com" target="_blank" rel="noreferrer" className="group flex items-center justify-center gap-3 bg-[#EA4335] text-white border-4 border-white p-4 font-black uppercase text-lg shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-12 transition-transform">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Email
              </a>

              {/* GitHub */}
              <a href="https://github.com/RiCE-Desu" target="_blank" rel="noreferrer" className="group flex items-center justify-center gap-3 bg-white text-black border-4 border-white p-4 font-black uppercase text-lg shadow-[6px_6px_0px_0px_rgba(234,179,8,1)] hover:shadow-[0px_0px_0px_0px_rgba(234,179,8,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-12 transition-transform">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                GitHub
              </a>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}