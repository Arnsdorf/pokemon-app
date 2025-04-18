export default function TeamDisplay({ team }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
            {team.map((pokemon, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-20 h-20 mb-2" />
                    <h2 className="text-xl font-bold">{pokemon.name.toUpperCase()}</h2>
                </div>
            ))}
        </div>
    );
}
