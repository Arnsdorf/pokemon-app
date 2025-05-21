// components/StyledPokemonCard.jsx

export default function StyledPokemonCard({ pokemon, index, typeColors, onRemove, onAdd }) {
    if (!pokemon) {
        return (
            <div
                onClick={onAdd}
                className="flex items-center h-48 justify-center text-center bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl w-full aspect-square cursor-pointer hover:bg-gray-700 transition"
            >
                <div className="flex flex-col items-center">
                    <span className="text-4xl text-gray-400">+</span>
                    <p className="text-sm mt-2 text-gray-400">Add Pokémon</p>
                </div>
            </div>
        );
    }


    const primaryType = pokemon.types[0]?.type?.name;
    const ringClass = typeColors[primaryType] || "ring-gray-500";

    return (
        <div
            className={`group p-4 h-48 justify-center rounded-xl shadow-lg flex flex-col items-center transition bg-gradient-to-br from-gray-800 to-gray-700 relative w-full aspect-square`}
        >
            {/* Fjern-knap */}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="absolute top-2 right-2 opacity-0 cursor-pointer group-hover:opacity-100 text-red-400 hover:text-red-300 transition"
                    title="Remove Pokémon"
                >
                    ✖️
                </button>
            )}

            {/* Sprite */}
            <div className="w-20 h-20 overflow-hidden flex items-center justify-center relative mb-2">
                <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                    alt={pokemon.name}
                    className="group-hover:hidden absolute object-contain w-full h-full"

                />
                <img
                    src={`https://play.pokemonshowdown.com/sprites/gen5ani/${pokemon.name.toLowerCase()}.gif`}
                    alt={pokemon.name}
                    className="hidden group-hover:block absolute object-contain w-full h-full scale-90"

                />
            </div>

            <p className="text-sm mb-2 px-3 py-1 rounded-full bg-gray-700 text-white shadow-inner capitalize">
                {pokemon.name}
            </p>

            <div className="flex gap-2 flex-wrap justify-center mt-1">
                {pokemon.types.map((t, i) => {
                    const typeName = typeof t === "string" ? t : t.type.name;
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
