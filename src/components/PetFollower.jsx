import React, { useState, useEffect } from 'react';

export default function PetFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isFacingLeft, setIsFacingLeft] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    let timeoutId;

    const handleMouseMove = (e) => {
      // Cek arah pergerakan kursor (ke kiri atau ke kanan)
      setPosition((prev) => {
        if (e.clientX < prev.x) {
          setIsFacingLeft(true);
        } else if (e.clientX > prev.x) {
          setIsFacingLeft(false);
        }
        
        // Kucing akan mengikuti posisi kursor (dikurangi offset agar pas di bawah kursor)
        return { x: e.clientX, y: e.clientY };
      });

      // Triger status bergerak untuk animasi jalan
      setIsMoving(true);

      // Jika kursor diam selama 100ms, hentikan animasi jalan (kucing idle)
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMoving(false);
      }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-300 ease-out select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y + 15}px`, // Ditambah 15px ke bawah kursor biar ga nutupin kursor utama
        transform: `translate(-50%, -50%) scaleX(${isFacingLeft ? -1 : 1})`,
      }}
    >
      {/* 
        Kamu bisa pakai GIF kucing piksel transparan.
        Jika tidak bergerak (idle), dia pakai gambar diam. Jika bergerak, pakai gif jalan.
      */}
      <img
        src={
          isMoving
            ? 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3N5c2V5cWpxb2s5dG5wY295MXB2Znd5OHd5M3o0ZHd4ZHd4ZHd4ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3oriO0OEd9QIDdllqo/giphy.gif' // Contoh GIF Kucing Jalan
            : 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3N5c2V5cWpxb2s5dG5wY295MXB2Znd5OHd5M3o0ZHd4ZHd4ZHd4ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3oriO0OEd9QIDdllqo/giphy.gif' 
        }
        alt="kucing portofolio"
        className="w-12 h-12 object-contain"
      />
    </div>
  );
}