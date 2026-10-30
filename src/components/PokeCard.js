export default function PokemonCard({ pokemon, onRemove }) {
    if (!pokemon || !pokemon.name || !pokemon.types) return null;

    const isMissingNo = pokemon.name.toLowerCase() === "missingno";

    const getStaticSprite = (pokemon) => {
        const id = pokemon.id;
        const name = pokemon.name.toLowerCase();

        if (isMissingNo) return "https://play.pokemonshowdown.com/sprites/gen1/missingno.png";
        if (id >= 1 && id <= 251) return `https://play.pokemonshowdown.com/sprites/gen2/${name}.png`;
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    };

    return (
        <div
            onClick={() => onRemove(pokemon.name)}
            className="group bg-white/5 backdrop-blur-md rounded-lg border border-white/20 shadow
                 p-2 flex flex-col items-center justify-evenly cursor-pointer
                 hover:bg-red-600/60 transition w-6/6"
            title="Click to remove"
        >
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center relative">
                <img
                    src={getStaticSprite(pokemon)}
                    alt={pokemon.name}
                    className="object-contain w-full h-full"
                />
            </div>

            <p className="font-bold capitalize mt-1 text-xs sm:text-sm">{pokemon.name}</p>
            <p className="text-[10px] sm:text-xs font-typefont text-gray-300 text-center">
                {pokemon.types.map((t) => t.type.name).join(" / ")}
            </p>
        </div>
    );
}
