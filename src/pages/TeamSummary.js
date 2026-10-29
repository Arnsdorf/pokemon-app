import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TeamStats from "@/components/TeamStats";
import TeamModal from "@/components/TeamModal";
import toast from "react-hot-toast";
import { typeColors } from "@/lib/utils";
import StyledPokemonCard from "@/components/StylePokeCard";
import SearchModal from "@/components/SearchModal";


export default function TeamSummary() {
    const router = useRouter();
    const [team, setTeam] = useState([null, null, null, null, null, null]);
    const [teamName, setTeamName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("currentTeam");
        const index = localStorage.getItem("editingIndex");
        const name = localStorage.getItem("currentTeamName");

        if (saved) {
            const loadedTeam = JSON.parse(saved);
            const paddedTeam = [...loadedTeam, ...Array(6 - loadedTeam.length).fill(null)];
            setTeam(paddedTeam);
        }

        if (index !== null) {
            setEditingIndex(Number(index));
            localStorage.removeItem("editingIndex");
        }

        if (name) {
            setTeamName(name);
            localStorage.removeItem("currentTeamName");
        }
    }, []);

    const handleSelectPokemon = async (selected) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${selected.name}`);
        const data = await response.json();

        const updated = [...team];
        updated[selectedIndex] = data;
        setTeam(updated);
        setIsSearchOpen(false);
    };



    const saveTeam = () => {
        if (teamName.trim() === "" || team.every(p => p === null)) {
            toast.error("Udfyld holdnavn og vælg mindst 1 Pokémon");
            return;
        }



        const slimmedTeam = team
            .filter(p => p !== null)
            .map(p => ({
                name: p.name,
                sprite: p.sprites?.front_default || p.sprite,
                stats: p.stats,
                types: p.types,
            }));

        const newTeam = { name: teamName, pokemons: slimmedTeam };
        const existingTeams = JSON.parse(localStorage.getItem("savedTeams")) || [];
        const updatedTeams = editingIndex !== null
            ? [...existingTeams.slice(0, editingIndex), newTeam, ...existingTeams.slice(editingIndex + 1)]
            : [...existingTeams, newTeam];

        localStorage.setItem("savedTeams", JSON.stringify(updatedTeams));

        setTeam([]);
        setTeamName("");
        setIsModalOpen(false);
        setEditingIndex(null);
        toast.success("Holdet er gemt");

        router.push("/SavedTeams");
    };

    return (
        <div className="md:h-screen relative text-white overflow-hidden">


            {/* Glas-container */}
            <div className="relative z-10 max-w-6xl mx-auto space-y-10 bg-black/20 shadow-lg p-4 px-10">
                {/* Header med team-navn og knapper */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-3xl font-bold text-center my-5 md:my-0">
                        Your Team Summary
                    </h2>

                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow"
                        >
                            Save team
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm shadow"
                        >
                            Edit team
                        </button>
                        <button
                            onClick={() => router.push("/SavedTeams")}
                            className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-600 shadow"
                        >
                            ← Back
                        </button>
                    </div>
                </div>


                {/* Modal */}
                <TeamModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    teamName={teamName}
                    setTeamName={setTeamName}
                    onSave={saveTeam}
                />

                {/* Pokémon Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Array.from({length: 6}).map((_, i) => {
                        const poke = team[i];

                        return (
                            <StyledPokemonCard
                                key={i}
                                pokemon={poke}
                                index={i}
                                onRemove={poke ? () => {
                                    const updated = [...team];
                                    updated[i] = null;
                                    setTeam(updated);
                                } : undefined}
                                onAdd={!poke ? () => {
                                    setSelectedIndex(i);
                                    setIsSearchOpen(true);
                                } : undefined}
                                onClick={poke ? () => setSelectedPokemon(poke) : undefined}
                                typeColors={typeColors}
                            />
                        );
                    })}
                </div>

                {/* Stats */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-4">
                    <TeamStats team={team} />
                </div>

                {/* Search Modal */}
                {isSearchOpen && (
                    <SearchModal
                        isOpen={isSearchOpen}
                        onClose={() => setIsSearchOpen(false)}
                        onSelect={handleSelectPokemon}
                    />
                )}
            </div>
        </div>
    );
}
