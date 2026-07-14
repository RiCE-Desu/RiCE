import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function SongList({ currentTrack, isPlaying, toggleGlobalPlay, changeGlobalTrack, queueLength }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      const { data } = await supabase.from('songs_metadata').select('*').order('id', { ascending: false });
      if (data) {
        setSongs(data);
      }
      setLoading(false);
    };
    fetchSongs();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER BAR */}
        <div className="flex justify-between items-center border-4 border-black p-4 mb-8 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">VOL. 04: JUKEBOX TRANSMISSIONS</h1>
            <p className="text-xs font-mono text-gray-500 mt-1">* ANTRIEAN SHUFFLE ADIL SISA: {queueLength} TRACKS *</p>
          </div>
          <Link to="/" className="border-2 border-black px-4 py-2 font-mono text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors">⬅ BACK</Link>
        </div>

        {loading && <p className="text-center font-mono font-bold animate-pulse uppercase">[ ACCESSING WAVE PATTERNS... ]</p>}

        {/* LIST TRACKS */}
        <div className="space-y-4">
          {songs.map((song) => {
            const isThisTrackActive = currentTrack?.id === song.id;
            
            return (
              <div 
                key={song.id} 
                className={`border-4 border-black p-4 flex justify-between items-center transition-colors ${
                  isThisTrackActive ? 'bg-yellow-100' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div>
                  <h3 className="font-black text-md uppercase flex items-center gap-2">
                    {song.title}
                    {isThisTrackActive && <span className="text-xs animate-bounce">🎵</span>}
                  </h3>
                  <p className="text-xs font-mono text-gray-600">// ARTIST: {song.artist}</p>
                  {song.is_featured && (
                    <span className="bg-black text-white text-[9px] px-1.5 font-mono mt-1 inline-block">
                      📌 PINNED MAIN CORE
                    </span>
                  )}
                </div>

                {/* CONTROLLER INTEGRASI KE ROOT ENGINE */}
                <button
                  onClick={() => isThisTrackActive ? toggleGlobalPlay() : changeGlobalTrack(song)}
                  className={`border-2 border-black px-4 py-2 text-xs font-mono font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] ${
                    isThisTrackActive && isPlaying ? 'bg-red-600 text-white' : 'bg-black text-white hover:bg-white hover:text-black'
                  }`}
                >
                  {isThisTrackActive && isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}