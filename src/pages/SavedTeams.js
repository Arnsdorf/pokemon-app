import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
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
        <main className="relative z-10 min-h-screen px-4 pb-8 pt-20 text-white md:ml-64 md:p-8">
            <header className="mb-6 flex items-center gap-3">
                <h1 className="text-3xl font-bold">Saved Teams</h1>

                <span className="rounded-full bg-white/10 px-2.5 py-1 text-sm text-white/60">
                {savedTeams.length}
            </span>
            </header>

            {savedTeams.length === 0 ? (
                <p className="text-white/60">
                    No teams are currently saved.
                </p>
            ) : (
                <div className="overflow-hidden rounded-xl border border-white/10 bg-gray-900/50 backdrop-blur-md">
                    {savedTeams.map((team, index) => {
                        if (
                            !team ||
                            !team.name ||
                            !Array.isArray(team.pokemons)
                        ) {
                            return null;
                        }

                        const pokemons = team.pokemons.filter(
                            (pokemon) => pokemon?.name
                        );

                        return (
                            <section
                                key={index}
                                className="flex flex-col gap-4 border-b border-white/10 p-4 last:border-b-0 lg:flex-row lg:items-center lg:gap-6 lg:px-6"
                            >
                                {/* Team name */}
                                <div className="min-w-0 lg:w-44 lg:shrink-0">
                                    <h2 className="break-words text-lg font-semibold">
                                        {team.name}
                                    </h2>

                                    <p className="mt-1 text-xs text-white/45">
                                        {pokemons.length}/6 Pokémon
                                    </p>
                                </div>

                                {/* Pokémon og ledige pladser */}
                                <div className="grid min-w-0 flex-1 grid-cols-3 gap-2 sm:grid-cols-6">
                                    {Array.from({length: 6}, (_, slotIndex) => {
                                        const pokemon = team.pokemons[slotIndex];

                                        return pokemon?.name ? (
                                            <div
                                                key={slotIndex}
                                                className="flex min-w-0 flex-col items-center rounded-lg border border-white/10 bg-white/5 px-1 py-2"
                                            >
                                                {pokemon.name === "missingno" ? (
                                                    <img
                                                        src="/missingno.png"
                                                        alt="MissingNo"
                                                        className="h-14 w-14 object-contain"
                                                    />
                                                ) : (
                                                    <Image
                                                        src={getSpriteUrl(pokemon)}
                                                        alt={pokemon.name}
                                                        width={56}
                                                        height={56}
                                                        className="h-14 w-14 object-contain"
                                                    />
                                                )}

                                                <span
                                                    className="mt-1 w-full break-words text-center text-[11px] capitalize text-white/70">
                                                    {pokemon.name}
                                                </span>
                                            </div>
                                                 ) : (
                                            <div
                                                key={slotIndex}
                                                aria-label={`Slot ${slotIndex + 1}: No Pokémon selected`}
                                                className="flex min-w-0 flex-col items-center justify-center rounded-lg border border-dashed border-white/25 bg-black/15 px-1 py-2"
                                            >
                                                <div
                                                    aria-hidden="true"
                                                    className="flex h-14 items-center justify-center"
                                                >
                                                <span
                                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xs font-medium text-white/45">
                                                    {slotIndex + 1}
                                                </span>
                                                </div>

                                                <span className="mt-1 text-[11px] text-white/45">
                                                    Empty
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Actions */}
                                <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-white/10 pt-3 lg:border-0 lg:pt-0">
                                    <button
                                        type="button"
                                        onClick={() => editTeamName(index)}
                                        className="rounded-lg px-3 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-400"
                                    >
                                        Rename
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => deleteTeam(index)}
                                        className="rounded-lg px-3 py-2 text-sm text-white/60 transition hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-red-400"
                                    >
                                        Delete
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => viewTeamStats(team, index)}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                                    >
                                        View stats
                                    </button>
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </main>
    );


}
