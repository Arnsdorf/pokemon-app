import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TeamStats from "./teamStats";
import TeamModal from "./teamModal";
import toast from "react-hot-toast";
import { typeColors } from "@/lib/utils";
import StyledPokemonCard from "./stylePokeCard";
import SearchModal from "./SearchModal";

export default function TeamSummary() {
    const router = useRouter();
    const [team, setTeam] = useState([null, null, null, null, null, null]);
    const [teamName, setTeamName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);

    // Hent eksisterende data ved load
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
            localStorage.removeItem("editingIndex"); // ryd index med det samme
        }

        if (name) {
            setTeamName(name);
            localStorage.removeItem("currentTeamName"); // ryd navn også
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
            toast.success("Holdet er gemt");
            return;
        }

        const slimmedTeam = team.filter(p => p !== null).map((p) => ({
            name: p.name,
            id: p.id,
            sprite: p.sprite || p.sprites?.front_default,
            types: p.types,
        }));

        const newTeam = {
            name: teamName,
            pokemons: slimmedTeam,
        };

        const existingTeams = JSON.parse(localStorage.getItem("savedTeams")) || [];
        let updatedTeams;

        if (editingIndex !== null) {
            updatedTeams = [...existingTeams];
            updatedTeams[editingIndex] = newTeam; // opdater eksisterende
        } else {
            updatedTeams = [...existingTeams, newTeam]; // tilføj som nyt
        }

        localStorage.setItem("savedTeams", JSON.stringify(updatedTeams));

        setTeam([]);
        setTeamName("");
        setIsModalOpen(false);
        setEditingIndex(null);

        router.push("/savedTeams");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-4xl font-bold tracking-wide">Your Team Summary</h1>
                    <div className="flex gap-3">
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
                            onClick={() => router.push("/savedTeams")}
                            className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-600 shadow"
                        >
                            ← Back
                        </button>
                    </div>
                </div>

                <TeamModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    teamName={teamName}
                    setTeamName={setTeamName}
                    onSave={saveTeam}
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
                    {Array.from({ length: 6 }).map((_, i) => {
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
                                typeColors={typeColors}
                            />
                        );
                    })}

                </div>

                <TeamStats team={team} />

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
