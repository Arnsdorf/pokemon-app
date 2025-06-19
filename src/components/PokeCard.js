// PokemonCard.js
export default function PokemonCard({ pokemon, onRemove }) {
    if (!pokemon || !pokemon.name || !pokemon.types) return null;

    const isMissingNo = pokemon.name.toLowerCase() === "missingno";

    return (
        <div
            onClick={() => onRemove(pokemon.name)}
            className="group bg-white/5 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-4 flex flex-col items-center cursor-pointer hover:bg-red-600/60 transition w-40 h-48"
            title="Click to remove"
        >
            <div className="w-25 h-25 overflow-hidden flex items-center justify-center relative">
                <img
                    src={isMissingNo ? "/missingno.png" : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                    alt={pokemon.name}
                    className="group-hover:hidden absolute object-contain  w-full h-full"
                />
                <img
                    src={isMissingNo ? "/missingno.png" : `https://play.pokemonshowdown.com/sprites/gen5ani/${pokemon.name.toLowerCase()}.gif`}
                    alt={pokemon.name}
                    className="hidden group-hover:block  absolute object-contain w-full h-full"
                />
            </div>
            <p className="font-bold capitalize mt-2">{pokemon.name}</p>
            <p className="text-sm text-gray-300">
                {pokemon.types.map((t) => t.type.name).join(" / ")}
            </p>
            <span className="text-xs text-gray-300">(Click to remove)</span>
        </div>
    );
}
