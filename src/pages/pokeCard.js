export default function PokemonCard({ pokemon, onRemove }) {
    if (!pokemon || !pokemon.id || !pokemon.name || !pokemon.types) {
        return null; // Eller vis en placeholder
    }

    return (
        <div
            onClick={() => onRemove(pokemon.name)}
            className="group bg-gray-700 p-4 rounded-xl shadow flex flex-col items-center cursor-pointer hover:bg-red-600 transition w-40 h-48"
            title="Klik for at fjerne"
        >
            <div className="w-20 h-20 overflow-hidden flex items-center justify-center relative">
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
            <p className="font-bold capitalize mt-2">{pokemon.name}</p>
            <p className="text-sm text-gray-300">
                {pokemon.types.map((t) => t.type.name).join(" / ")}
            </p>
            <span className="text-xs text-gray-300">(Klik for at fjerne)</span>
        </div>
    );
}
