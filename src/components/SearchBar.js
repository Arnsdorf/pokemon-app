import { Search, X } from "lucide-react";



export default function SearchBar({
                                      value,
                                      onChange,
                                      suggestions = [],
                                      onSelect,
                                  }) {
    const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];
    return (
        <div className="relative w-full sm:w-80">
            <div className="flex items-center gap-2 rounded border border-white/20 bg-white/5 px-3 backdrop-blur-md focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20">
                <Search
                    size={17}
                    aria-hidden="true"
                    className="shrink-0 text-gray-400"
                />

                <input
                    type="text"
                    aria-label="Search Pokémon"
                    placeholder="Search Pokémon..."
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent py-2 text-white placeholder:text-gray-400 focus:outline-none"
                />

                {value && (
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        aria-label="Clear search"
                        className="rounded p-1 text-gray-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-400"
                    >
                        <X size={15} aria-hidden="true" />
                    </button>
                )}
            </div>

            {value?.trim().length > 0 && safeSuggestions.length > 0 && (
                <ul className="absolute inset-x-0 z-50 mt-1 max-h-40 overflow-y-auto rounded border border-white/20 bg-black/70 backdrop-blur-md">
                    {safeSuggestions.map((name) => (
                        <li key={name}>
                            <button
                                type="button"
                                onClick={() => onSelect(name)}
                                className="w-full p-2 text-left text-sm text-white transition hover:bg-white/10"
                            >
                                {name.toUpperCase()}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}