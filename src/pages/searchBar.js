import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchBar({ search, setSearch, suggestions, addPokemon }) {
    return (
        <div className="relative mb-6">
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Search Pokémon..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-80"
                />
                <Button onClick={() => addPokemon(search)}>Search</Button>
            </div>

            {suggestions.length > 0 && (
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
