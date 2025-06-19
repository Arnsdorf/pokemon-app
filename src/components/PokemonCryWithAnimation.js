import { useState } from "react";

export default function PokemonCryWithAnimation({ name }) {
    const [isPlaying, setIsPlaying] = useState(false);

    if (!name) return null;

    const playCry = () => {
        const audio = new Audio(`https://play.pokemonshowdown.com/audio/cries/${name.toLowerCase()}.mp3`);
        setIsPlaying(true);
        audio.play();

        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
            console.warn("Cry not available for:", name);
            setIsPlaying(false);
        };
    };

    const staticUrl = `https://play.pokemonshowdown.com/sprites/gen5/${name.toLowerCase()}.png`;

    const animatedUrl = `https://play.pokemonshowdown.com/sprites/gen5ani/${name.toLowerCase()}.gif`;

    return (
        <div className="relative w-32 h-32">
            <img
                src={isPlaying ? animatedUrl : staticUrl}
                alt={name}
                className={`w-full h-full object-contain p-4 bg-gray-700 rounded-xl transition-all duration-300  
    ${!animatedUrl ? "p-4" : ""}`}
            />


            <button
                onClick={playCry}
                className={`absolute bottom-1 cursor-pointer right-1 w-8 h-8 flex items-center justify-center
    bg-gray-700 text-white hover:bg-gray-600
    border border-gray-600 shadow-inner backdrop-blur-sm
    rounded-full transition-all duration-300
    ${isPlaying ? "" : ""}`}
                title="Play cry"
            >
                🔊
            </button>


        </div>
    );
}
