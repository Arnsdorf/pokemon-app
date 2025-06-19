import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Filter, { generations } from "./filter";
import Image from "next/image";

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
        toast.success("Team has been removed.");
    };

    const editTeamName = (index) => {
        const newName = prompt("New name for your team:", savedTeams[index].name);
        if (newName && newName.trim() !== "") {
            const updated = [...savedTeams];
            updated[index].name = newName.trim();
            setSavedTeams(updated);
            localStorage.setItem("savedTeams", JSON.stringify(updated));
            toast.success("Team name has been updated. ");
        }
    };

    const viewTeamStats = (team, index) => {
        localStorage.setItem("currentTeam", JSON.stringify(team.pokemons));
        localStorage.setItem("editingIndex", index);
        localStorage.setItem("currentTeamName", team.name);
        router.push("/TeamSummary");
    };



    return (
        <div className="min-h-screen text-white flex">

            <Navbar />
            <div className="flex-1 z-10 ms-63 p-6">
                <h1 className="text-3xl font-bold mb-6">Saved Teams</h1>

                {savedTeams.length === 0 ? (
                    <p className="text-gray-400">No teams are currently saved.</p>
                ) : (
                    <div className="space-y-6">
                        {savedTeams.map((team, index) => {
                            if (!team || !team.name || !Array.isArray(team.pokemons)) return null;

                            return (
                                <div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-md border border-white/20 shadow-lg p-6 rounded-2xl max-w-3xl ml-0"
                                >
                                    {/* Header med team-navn og knapper */}
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold tracking-wide">{team.name}</h2>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => editTeamName(index)}
                                                className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-500 cursor-pointer rounded-full shadow"
                                            >
                                                Edit team name
                                            </button>
                                            <button
                                                onClick={() => deleteTeam(index)}
                                                className="text-sm px-4 py-2 bg-red-600 hover:bg-red-500 cursor-pointer rounded-full shadow"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => viewTeamStats(team, index)}
                                                className="text-sm px-4 py-2 bg-green-600 hover:bg-green-500 cursor-pointer rounded-full shadow"
                                            >
                                                View stats
                                            </button>
                                        </div>
                                    </div>

                                    {/* Pokémon visning */}
                                    <div className="flex flex-wrap justify-between mt-5 gap-4 rounded-xl">
                                        {team.pokemons.map((pokemon, i) => {
                                            if (!pokemon || !pokemon.name) return null;

                                            return (
                                                <div
                                                    key={i}
                                                    className="flex flex-col items-center bg-white/5 backdrop-blur-md border border-white/20 p-3 rounded-lg shadow w-24 hover:scale-105 transition"
                                                >

                                                    {pokemon.name === "missingno" ? (
                                                        <img
                                                            src="/missingno.png"
                                                            alt="MissingNo"
                                                            className="w-[80px] h-[80px] object-contain"

                                                        />
                                                    ) : (
                                                        <Image
                                                            src={pokemon.sprite || pokemon.sprites?.front_default}
                                                            alt={pokemon.name}
                                                            width={80}
                                                            height={80}
                                                            className="object-contain"
                                                        />
                                                    )}


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
