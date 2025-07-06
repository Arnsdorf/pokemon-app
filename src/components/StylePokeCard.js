import { useRouter } from "next/router";

export default function StyledPokemonCard({
                                              pokemon,
                                              index,
                                              typeColors,
                                              onRemove,
                                              onAdd
                                          }) {
    const router = useRouter();

    if (!pokemon) {
        return (
            <div
                onClick={onAdd}
                className="flex items-center h-48 hover:scale-105 justify-center text-center  bg-white/5 backdrop-blur-md border-white/20 border-2 border-dashed border-gray-600 rounded-xl w-full aspect-square cursor-pointer hover:bg-white/10 transition"
            >
                <div className="flex flex-col  items-center">
                    <span className="text-4xl text-gray-400 ">+</span>
                    <p className="text-sm mt-2 text-gray-400">Add Pokémon</p>
                </div>
            </div>
        );
    }

    const getSpriteUrl = (pokemon) => {
        if (!pokemon || !pokemon.name) return "";

        const id = pokemon.id;
        const name = pokemon.name.toLowerCase();

        if (name === "missingno") {
            return "https://play.pokemonshowdown.com/sprites/gen1/missingno.png";
        }

        if (id >= 1 && id <= 151) {
            return `https://play.pokemonshowdown.com/sprites/gen1/${name}.png`;
        }

        if (id >= 152 && id <= 251) {
            return `https://play.pokemonshowdown.com/sprites/gen2/${name}.png`;
        }

        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    };



    const isMissingNo = pokemon.name?.toLowerCase() === "missingno";
    const primaryType = isMissingNo
        ? "glitch"
        : pokemon.types?.[0]?.type?.name || "unknown";

    return (
        <div
            className="group p-4 h-48 justify-center bg-white/5 backdrop-blur-md rounded-xl border border-white/20 shadow-lg flex flex-col items-center transition relative w-full aspect-square cursor-pointer">
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 flex flex-col">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/pokemon/${pokemon.name}`);
                    }}
                    className="h-1/2 bg-black/40 backdrop-blur-md hover:shadow-lg text-white text-sm w-full cursor-pointer rounded-t-xl transition-transform duration-100 ease-out"
                >
                    🔍 See stats
                </button>

                {onRemove && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        className="h-1/2 bg-red-700 hover:bg-red-800 text-white text-sm w-full cursor-pointer rounded-b-xl transition-transform duration-100 ease-out"
                    >
                        🗑️ Remove Pokémon
                    </button>
                )}
            </div>

            {/* Sprite */}
            <div className="w-20 h-20 overflow-hidden flex items-center justify-center relative mb-2">
                {/* Første billede (vises normalt) */}
                <img
                    src={getSpriteUrl(pokemon)}
                    alt={pokemon.name}
                    className="group-hover:hidden absolute object-contain w-full h-full"
                    loading="lazy"
                />


            </div>


            <p className="text-sm mb-2 px-3 py-1 rounded-full bg-gray-700 text-white shadow-inner capitalize">
                {pokemon.name}
            </p>

            <div className="flex gap-2 flex-wrap justify-center mt-1">
                {(pokemon.types || [{type: {name: "glitch"}}]).map((t, i) => {
                    const typeName = typeof t === "string" ? t : t.type?.name;
                    return (
                        <span
                            
                            key={i}

                            className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${typeColors[typeName] || "bg-gray-600 text-white"}`}
                        >
                            {typeName}

                        </span>
                    );
                })}
            </div>
        </div>
    );
}
