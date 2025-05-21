import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Filter, { generations } from "./Filter";

export default function SavedTeamsPage() {
    const [savedTeams, setSavedTeams] = useState([]);
    const [team, setTeam] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const router = useRouter();
    const [teamName, setTeamName] = useState("");



    useEffect(() => {
        const saved = localStorage.getItem("savedTeams");
        if (saved) {
            setSavedTeams(JSON.parse(saved));
        }
    }, []);


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
        }

        if (name) {
            setTeamName(name);
        }
    }, []);




    const deleteTeam = (index) => {
        const updated = savedTeams.filter((_, i) => i !== index);
        setSavedTeams(updated);
        localStorage.setItem("savedTeams", JSON.stringify(updated));
        toast.success("Holdet blev slettet.");
    };

    const editTeamName = (index) => {
        const newName = prompt("Nyt navn til holdet:", savedTeams[index].name);
        if (newName && newName.trim() !== "") {
            const updated = [...savedTeams];
            updated[index].name = newName.trim();
            setSavedTeams(updated);
            localStorage.setItem("savedTeams", JSON.stringify(updated));
            toast.success("Holdnavnet er opdateret.");
        }
    };

    const viewTeamStats = (team, index) => {
        localStorage.setItem("currentTeam", JSON.stringify(team.pokemons));
        localStorage.setItem("editingIndex", index);
        localStorage.setItem("currentTeamName", team.name);
        router.push("/teamSummary");
    };



    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            <Navbar />
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-bold mb-6">Gemte Teams</h1>

                {savedTeams.length === 0 ? (
                    <p className="text-gray-400">Ingen teams gemt endnu.</p>
                ) : (
                    <div className="space-y-6">
                        {savedTeams.map((team, index) => {
                            if (!team || !team.name || !Array.isArray(team.pokemons)) return null;

                            return (
                                <div
                                    key={index}
                                    className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-2xl shadow-lg max-w-3xl ml-0"
                                >
                                    {/* Header med team-navn og knapper */}
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold tracking-wide">{team.name}</h2>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => editTeamName(index)}
                                                className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-full shadow"
                                            >
                                                Edit team name
                                            </button>
                                            <button
                                                onClick={() => deleteTeam(index)}
                                                className="text-sm px-4 py-2 bg-red-600 hover:bg-red-500 rounded-full shadow"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => viewTeamStats(team, index)}
                                                className="text-sm px-4 py-2 bg-green-600 hover:bg-green-500 rounded-full shadow"
                                            >
                                                View stats
                                            </button>
                                        </div>
                                    </div>

                                    {/* Pokémon visning */}
                                    <div className="flex flex-wrap justify-center gap-4 p-4 bg-gray-800 rounded-xl">
                                        {team.pokemons.map((pokemon, i) => {
                                            if (!pokemon || !pokemon.name) return null;

                                            return (
                                                <div
                                                    key={i}
                                                    className="flex flex-col items-center bg-gray-700 p-3 rounded-lg shadow w-24 hover:scale-105 transition"
                                                >
                                                    <img
                                                        src={pokemon.sprite || pokemon.sprites?.front_default}
                                                        alt={pokemon.name}
                                                        className="w-16 h-16 image-rendering-pixelated"
                                                    />
                                                    <span className="mt-2 capitalize text-sm text-white text-center">
                          {pokemon.name}
                        </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );


}
