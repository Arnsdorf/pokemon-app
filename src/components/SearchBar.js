export default function SearchBar({ value, onChange, suggestions, onSelect }) {
    return (
        <div className="relative mb-6">
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Search Pokémon..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-80 px-3 py-2 rounded bg-white/5 backdrop-blur-md border border-white/20 text-white focus:outline-none"
                />
                <button
                    onClick={() => onSelect(value)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
                >
                    Search
                </button>
            </div>

            {value.length > 0 && suggestions?.length > 0 && (
                <ul className="absolute w-80 bg-white/5 backdrop-blur-md border border-white/20 rounded mt-1 max-h-40 overflow-y-auto z-10">
                    {suggestions.map((name, index) => (
                        <li
                            key={index}
                            className="p-2 hover:bg-gray-700 cursor-pointer"
                            onClick={() => onSelect(name)}
                        >
                            {name.toUpperCase()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
