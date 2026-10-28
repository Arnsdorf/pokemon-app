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


    const getSpriteUrl = (pokemon) => {
        if (!pokemon?.name) return "";

        const id = pokemon.id;
        const name = pokemon.name.toLowerCase();

        if (name === "missingno") {
            return "/missingno.png";
        }

        if (id >= 1 && id <= 251) {
            return `https://play.pokemonshowdown.com/sprites/gen2/${name}.png`;
        }

        if (id) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
        }

        return pokemon.sprite || "";
    };
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


            <div className="flex-1 z-10 p-6">
                <h1 className="text-3xl md:ml-70 font-bold mb-6">Saved Teams</h1>

                {savedTeams.length === 0 ? (
                    <p className="text-gray-400">No teams are currently saved.</p>
                ) : (
                    <div className="space-y-6">
                        {savedTeams.map((team, index) => {
                            if (!team || !team.name || !Array.isArray(team.pokemons)) return null;

                            return (
                                <div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-md border md:ml-70 border-white/20 shadow-lg p-6 rounded-2xl max-w-3xl"
                                >
                                    {/* Header med team-navn og knapper */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <h2 className="text-2xl sm:text-xl font-bold text-center sm:text-left">
                                            {team.name}
                                        </h2>

                                        <div className="flex flex-wrap justify-center border-t pt-5 border-white/20 sm:border-none md:pt-0 lg:pt-0  sm:justify-end gap-2">
                                            <button
                                                onClick={() => editTeamName(index)}
                                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm">
                                                Edit team name
                                            </button>
                                            <button
                                                onClick={() => deleteTeam(index)}
                                                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full text-sm">
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => viewTeamStats(team, index)}
                                                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full text-sm">
                                                View stats
                                            </button>
                                        </div>
                                    </div>



                                    {/* Pokémon visning */}
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-5">

                                        {team.pokemons.map((pokemon, i) => {
                                            if (!pokemon || !pokemon.name) return null;

                                            return (
                                                <div
                                                    key={i}
                                                    className="flex flex-col items-center bg-white/5 backdrop-blur-md border border-white/20 p-3 rounded-lg shadow hover:scale-105 transition"
                                                >

                                                    {pokemon.name === "missingno" ? (
                                                        <img
                                                            src="/missingno.png"
                                                            alt="MissingNo"
                                                            className="w-[80px] h-[80px] object-contain"

                                                        />
                                                    ) : (
                                                        <Image
                                                            src={getSpriteUrl(pokemon)}
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
