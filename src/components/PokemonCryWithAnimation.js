import { useState } from "react";

export default function PokemonCryWithAnimation({ name, id }) {
    const [isPlaying, setIsPlaying] = useState(false);

    if (!name) return null;

    const getSpriteUrl = () => {
        if (!name) return "";

        const lowerName = name.toLowerCase();

        if (lowerName === "missingno") {
            return "https://play.pokemonshowdown.com/sprites/gen1/missingno.png";
        }

        if (id >= 1 && id <= 151) {
            return `https://play.pokemonshowdown.com/sprites/gen1/${lowerName}.png`;
        }

        if (id >= 152 && id <= 251) {
            return `https://play.pokemonshowdown.com/sprites/gen2/${lowerName}.png`;
        }

        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    };

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


    return (
        <div className="relative w-32 h-32">
            <img
                src={getSpriteUrl()}
                alt={name}
                className="w-full h-full object-contain p-4 bg-gray-700 rounded-xl transition-all duration-300"
            />

            <button
                onClick={playCry}
                className="absolute bottom-1 right-1 w-8 h-8 flex items-center justify-center
                           bg-gray-700 text-white hover:bg-gray-600 border border-gray-600
                           shadow-inner backdrop-blur-sm rounded-full transition"
                title="Play cry"
            >
                🔊
            </button>
        </div>
    );
}
