import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TeamStats from "./teamStats";
import TeamModal from "./teamModal";
import toast from "react-hot-toast";



export default function TeamSummary() {
    const router = useRouter();
    const [team, setTeam] = useState([]);
    const [teamName, setTeamName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedTeams, setSavedTeams] = useState([]);

    // Hent team fra localStorage
    useEffect(() => {
        const saved = localStorage.getItem("currentTeam");
        if (saved) {
            setTeam(JSON.parse(saved));
        }
    }, []);



    const saveTeam = () => {
        if (teamName.trim() === "" || team.length === 0) {
            toast.error("Udfyld holdnavn og vælg mindst 1 Pokémon");
            return;
        }

        const newTeam = {
            name: teamName,
            pokemons: team,
        };

        const existingTeams = JSON.parse(localStorage.getItem("savedTeams")) || [];
        const updatedTeams = [...existingTeams, newTeam];

        localStorage.setItem("savedTeams", JSON.stringify(updatedTeams));
        console.log("✅ Holdet blev gemt!");


        setTeam([]);
        setTeamName("");
        setIsModalOpen(false);


        router.push("/savedTeams");
    };


    const deleteTeam = (index) => {
        const updated = savedTeams.filter((_, i) => i !== index);
        setSavedTeams(updated);
        router.push("/");
        localStorage.setItem("savedTeams", JSON.stringify(updated));
        toast.success("Holdet blev slettet.");
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <div className="max-w-5xl mx-auto">
                {/* Overskrift + knapper */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold">Team Oversigt</h1>

                    {/* Knap-container */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                console.log("🔵 Klikket på GEM HOLD-knap");
                                setIsModalOpen(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                        >
                            Gem hold
                        </button>
                        <button
                            onClick={() => deleteTeam()}
                            className="text-sm px-3 py-1 bg-red-600 hover:bg-red-500 rounded"
                        >
                            Slet
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded border border-gray-600 transition"
                        >
                            ← Tilbage
                        </button>
                    </div>
                </div>

                {/* TeamModal skal være uden for conditional rendering */}
                <TeamModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    teamName={teamName}
                    setTeamName={setTeamName}
                    onSave={saveTeam}
                />

                {/* Hvis teamet er tomt */}
                {team.length === 0 ? (
                    <div className="text-gray-400 text-center py-20 border border-gray-700 rounded-lg">
                        <p className="text-lg">Ingen teamdata fundet.</p>
                        <p className="text-sm mt-2">Gå tilbage og byg et hold først.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
                            {team.map((pokemon, i) => (
                                <div
                                    key={i}
                                    className="bg-gradient-to-br from-gray-800 to-gray-700 p-4 rounded-xl shadow flex flex-col items-center"
                                >
                                    <img
                                        src={pokemon.sprite}
                                        alt={pokemon.name}
                                        className="w-20 h-20 mb-2"
                                    />

                                    <p className="text-sm text-gray-400">
                                        {pokemon.types.map((t) => t.type.name).join(" / ")}
                                    </p>
                                    <p className="text-lg font-semibold capitalize">
                                        {pokemon.name}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Stats-komponent */}
                        <TeamStats team={team} />
                    </>
                )}
            </div>
        </div>
    );
}
