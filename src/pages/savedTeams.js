import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function SavedTeamsPage() {
    const [savedTeams, setSavedTeams] = useState([]);
    const router = useRouter();
    const [team, setTeam] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem("savedTeams");
        if (saved) {
            setSavedTeams(JSON.parse(saved));
        }
    }, []);


    useEffect(() => {
        const saved = localStorage.getItem("currentTeam");
        if (saved) {
            setTeam(JSON.parse(saved));
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

    const viewTeamStats = (team) => {
        localStorage.setItem("currentTeam", JSON.stringify(team.pokemons));
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
                        {savedTeams.map((team, index) => (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-lg font-bold">{team.name}</h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => editTeamName(index)}
                                            className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded"
                                        >
                                            Rediger
                                        </button>
                                        <button
                                            onClick={() => deleteTeam(index)}
                                            className="text-sm px-3 py-1 bg-red-600 hover:bg-red-500 rounded"
                                        >
                                            Slet
                                        </button>
                                        <button
                                            onClick={() => viewTeamStats(team)}
                                            className="text-sm px-3 py-1 bg-green-600 hover:bg-green-500 rounded"
                                        >
                                            Se stats
                                        </button>

                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                                {team.pokemons.map((pokemon, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col items-center bg-gray-700 p-2 rounded"
                                        >
                                            <img
                                                src={pokemon.sprite}
                                                alt={pokemon.name}
                                                className="w-16 h-16"
                                            />
                                            <span className="mt-2 capitalize text-sm">{pokemon.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
