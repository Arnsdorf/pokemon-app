export default function SearchBar({ search, setSearch, suggestions, addPokemon }) {
    return (
        <div className="relative mb-6">
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Search Pokémon..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-80 px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none"
                />
                <button
                    onClick={() => addPokemon(search)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
                >
                    Search
                </button>
            </div>

            {(suggestions?.length ?? 0) > 0 && (

                <ul className="absolute w-80 bg-gray-800 border border-gray-600 rounded mt-1 max-h-40 overflow-y-auto z-10">
                    {suggestions.map((name, index) => (
                        <li
                            key={index}
                            className="p-2 hover:bg-gray-700 cursor-pointer"
                            onClick={() => addPokemon(name)}
                        >
                            {name.toUpperCase()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
