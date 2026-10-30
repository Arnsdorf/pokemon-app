import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TeamStats from "../../components/TeamStats";
import EvolutionChain from "../../components/EvolutionChain";
import PokemonCryWithAnimation from "../../components/PokemonCryWithAnimation";
import PokemonBestMoves from "../../components/PokemonBestMoves";
import { typeColors } from "@/lib/utils";
import customPokemon from "@/lib/CustomPoke";
import MissingNoVariants from "@/components/MissingNoVariants";

export default function PokemonPage() {
    const router = useRouter();
    const { name } = router.query;

    const [team, setTeam] = useState([]);
    const [pokemon, setPokemon] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("currentTeam");
        if (saved) {
            const parsed = JSON.parse(saved);
            const padded = [...parsed, ...Array(6 - parsed.length).fill(null)];
            setTeam(padded);
        }
    }, []);

    const filteredTeam = team.filter((p) => p !== null);
    const currentFilteredIndex = filteredTeam.findIndex(
        (p) => p?.name?.toLowerCase() === name?.toLowerCase()
    );



    const handleNext = () => {
        const nextIndex = (currentFilteredIndex + 1) % filteredTeam.length;
        const nextPokemon = filteredTeam[nextIndex];

        if (nextPokemon) {
            const safeName = nextPokemon.name.toLowerCase().replace(/\W+/g, "");
            router.push(`/pokemon/${safeName}`);
        }
    };

    const handlePrev = () => {
        const prevIndex =
            (currentFilteredIndex - 1 + filteredTeam.length) % filteredTeam.length;
        const prevPokemon = filteredTeam[prevIndex];

        if (prevPokemon) {
            const safeName = prevPokemon.name.toLowerCase().replace(/\W+/g, "");
            router.push(`/pokemon/${safeName}`);
        }
    };


    useEffect(() => {
        if (!name) return;

        const fetchData = async () => {
            if (name.toLowerCase() === "missingno") {
                setPokemon(customPokemon.missingno);
                return;
            }

            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                const data = await res.json();

                const speciesRes = await fetch(data.species.url);
                const species = await speciesRes.json();

                data.species = { ...data.species, ...species };
                setPokemon(data);
            } catch (error) {
                console.error("Failed to fetch Pokémon:", error);
            }
        };

        fetchData();
    }, [name]);

    if (!pokemon || filteredTeam.length === 0) {
        return <p className="text-white p-10">Indlæser...</p>;
    }

    const types = pokemon.types.map((t) => t.type.name);

    return (
        <main className="relative text-white overflow-hidden">

            <div className="relative z-10 max-w-4xl bg-black/30 my-auto md:h-screen mx-auto p-6 space-y-8">
                {/* Navigation */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentFilteredIndex <= 0}
                            className="text-sm px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 disabled:opacity-40"
                        >
                            ← Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentFilteredIndex >= filteredTeam.length - 1}
                            className="text-sm px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 disabled:opacity-40"
                        >
                            Next →
                        </button>
                    </div>

                    <button
                        onClick={() => router.push("/TeamSummary")}
                        className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-600 shadow"
                    >
                        ← Back
                    </button>
                </div>

                {/* Hero Section */}
                <div className="flex flex-col md:flex-row items-center gap-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-6">
                    <PokemonCryWithAnimation name={pokemon.name} id={pokemon.id} />

                    <div className="space-y-3 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <h1 className="text-4xl font-bold capitalize">{pokemon.name}</h1>
                            <span className="text-xl font-medium">#{pokemon.id}</span>
                        </div>
                        <div className="flex gap-2 justify-center md:justify-start">
                            {types.map((type) => (
                                <span
                                    key={type}
                                    className={`px-4 py-1 text-xs rounded-full uppercase font-semibold ${typeColors[type] || "bg-gray-600"}`}
                                >
                  {type}
                </span>
                            ))}
                        </div>
                        <p className="text-sm text-gray-300 italic">
                            {pokemon.species?.flavor_text_entries?.find(
                                (e) => e.language.name === "en"
                            )?.flavor_text.replace(/\f/g, " ") || "No description"}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-4">
                    <TeamStats team={[pokemon]} />
                </div>

                {/* Evolution + Moves */}
                <div className="flex flex-col md:flex-row gap-6">
                    {pokemon.name?.toLowerCase() === "missingno" ? (
                        <div className="md:w-2/3 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
                            <h3 className="text-xl font-bold mb-4">Forms</h3>
                            <MissingNoVariants />
                        </div>
                    ) : (
                        <div className="md:w-2/3 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
                            <h3 className="text-xl font-bold mb-5">Evolution Chain</h3>
                            <EvolutionChain speciesUrl={pokemon.species?.url} />
                        </div>
                    )}

                    <div className="md:w-1/3 rounded-xl border border-white/20 shadow-lg">
                        <PokemonBestMoves name={pokemon.name} />
                    </div>
                </div>
            </div>
        </main>
    );
}
