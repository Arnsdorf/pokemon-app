import { useEffect, useState, useRef, useCallback } from "react";
import Filter, { generations } from "../pages/filter";
import { Listbox } from '@headlessui/react'
import customPokemon from "@/lib/CustomPoke";

export default function SearchModal({ isOpen, onClose, onSelect }) {
    const [search, setSearch] = useState("");
    const [generation, setGeneration] = useState("all");
    const [allPokemon, setAllPokemon] = useState([]);
    const [visiblePokemon, setVisiblePokemon] = useState([]);
    const [itemsToShow, setItemsToShow] = useState(30);
    const observer = useRef();

    // Hent Pokémon
    useEffect(() => {
        const fetchPokemon = async () => {
            const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
            const data = await res.json();
            const list = data.results.map((p, i) => ({ name: p.name, id: i + 1 }));
            setAllPokemon(list);
        };
        fetchPokemon();
    }, []);

    const handleAddMissingNo = () => {
        addPokemonData(customPokemon);
    };

    // Filter søgning + generation
    useEffect(() => {
        let filtered = allPokemon;

        if (search) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().startsWith(search.toLowerCase())
            );
        }

        if (generation !== "all") {
            filtered = filtered.filter(
                (p) =>
                    p.id >= generations[generation].start &&
                    p.id <= generations[generation].end
            );
        }

        setItemsToShow(30);
        setVisiblePokemon(filtered.slice(0, 30));
    }, [search, generation, allPokemon]);

    useEffect(() => {
        let filtered = allPokemon;

        if (search) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().startsWith(search.toLowerCase())
            );
        }

        if (generation !== "all") {
            filtered = filtered.filter(
                (p) =>
                    p.id >= generations[generation].start &&
                    p.id <= generations[generation].end
            );
        }

        setVisiblePokemon(filtered.slice(0, itemsToShow));
    }, [itemsToShow]);

    // Infinite scroll
    const lastRef = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setItemsToShow((prev) => prev + 20);
                }
            });
            if (node) observer.current.observe(node);
        },
        []
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div
                className="bg-gray-900 text-white w-full max-w-screen-md p-6 rounded-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-700">


                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
                    <h2 className="text-2xl font-bold tracking-wide">Choose a Pokémon</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✖</button>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search Pokémon..."
                            className="w-full px-10 py-2 rounded bg-gray-800 border border-gray-600"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    </div>

                    <Listbox value={generation} onChange={setGeneration}>
                        <div className="relative w-full sm:w-48">
                            <Listbox.Button
                                className="bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded w-full text-left">
                                {generation === 'all' ? 'All Gens' : `Gen ${generation.replace('gen', '')}`}
                            </Listbox.Button>
                            <Listbox.Options
                                className="absolute mt-1 w-full bg-gray-800 border border-gray-600 rounded shadow-lg z-10">
                                {Object.entries(generations).map(([key]) => (
                                    <Listbox.Option
                                        key={key}
                                        value={key}
                                        className={({active}) =>
                                            `cursor-pointer px-4 py-2 ${active ? 'bg-gray-700' : ''}`
                                        }
                                    >
                                        {key === 'all' ? 'All Gens' : `Gen ${key.replace('gen', '')}`}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </div>
                    </Listbox>
                </div>

                <hr className="border-gray-700 my-4"/>

                {/* Pokémon Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {visiblePokemon.map((pokemon, i) => {
                        const isLast = i === visiblePokemon.length - 1;
                        return (
                            <div
                                key={pokemon.id}
                                ref={isLast ? lastRef : null}
                                onClick={() => {
                                    onSelect(pokemon);
                                    onClose();
                                }}
                                className="bg-gray-800 p-4 rounded-xl flex flex-col items-center cursor-pointer hover:bg-gray-700 transition hover:scale-105 shadow"
                            >
                                <img
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/animated/${pokemon.id}.gif`}
                                    alt={pokemon.name}
                                    className="w-16 h-16"
                                />
                                <p className="capitalize mt-2 text-sm">{pokemon.name}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

    );
}
