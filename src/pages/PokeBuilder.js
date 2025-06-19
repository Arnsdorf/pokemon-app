import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";
import SearchBar from "@/components/SearchBar";
import Filter, { generations } from "./filter";
import TeamModal from "@/components/TeamModal";
import toast from "react-hot-toast";
import PokemonCard from "@/components/PokeCard";
import Image from "next/image";
import customPokemon from "@/lib/CustomPoke";

export default function PokemonTeamBuilder() {
  const [team, setTeam] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [generation, setGeneration] = useState("all");
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [allPokemon, setAllPokemon] = useState([]);
  const [visiblePokemon, setVisiblePokemon] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(30);

  const router = useRouter();

  // Hent alle Pokémoner
  useEffect(() => {
    const fetchAllPokemon = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
      const data = await res.json();
      const list = data.results.map((p, i) => ({ name: p.name, id: i + 1 }));
      setAllPokemon(list);
      setFilteredPokemon(list);
    };
    fetchAllPokemon();
  }, []);

  // Opdater filtreret liste baseret på søgning og generation
  useEffect(() => {
    let filtered = allPokemon;

    if (search.length > 0) {
      filtered = filtered.filter((pokemon) =>
          pokemon.name.startsWith(search.toLowerCase())
      );
    }


    if ("missingno".startsWith(search.toLowerCase()) && search.length > 0) {
      filtered.unshift({ name: "missingno", id: 0 });
    }

    if (generation !== "all") {
      filtered = filtered.filter(
          (pokemon) =>
              pokemon.id >= generations[generation].start &&
              pokemon.id <= generations[generation].end
      );
    }

    setFilteredPokemon(filtered);
    setSuggestions(filtered.map((p) => p.name));
    setItemsToShow(30);
    setVisiblePokemon(filtered.slice(0, 30));
  }, [search, generation, allPokemon]);

  // Opdater synlige Pokémon
  useEffect(() => {
    setVisiblePokemon(filteredPokemon.slice(0, itemsToShow));
  }, [filteredPokemon, itemsToShow]);

  // Infinite scroll observer
  const observer = useRef();
  const lastPokemonRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setItemsToShow((prev) => prev + 20);
      }
    });
    if (node) observer.current.observe(node);
  }, []);


  const addPokemon = async (pokemonName) => {
    if (!pokemonName || team.length >= 6) return;
    if (team.find((p) => p.name === pokemonName)) return;

    if (pokemonName.toLowerCase() === "missingno") {
      setTeam([...team, customPokemon.missingno]);
      setSearch("");
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setTeam([...team, data]);
      setSearch("");
      setSuggestions([]);
    } catch (error) {
      console.error("Failed to fetch Pokémon:", error);
    }
  };






  const removePokemon = (name) => {
    setTeam((prev) => prev.filter((p) => p.name !== name));
  };

  const resetTeam = () => setTeam([]);

  const saveTeam = () => {
    if (teamName.trim() === "" || team.length === 0) {
      toast.error("Fill out team name and choose at least 1 Pokémon");
      return;
    }

    const slimmedTeam = team.map((p) => ({
      name: p.name,
      sprite:
          p.name === "missingno"
              ? "/missingno.png"
              : p.sprites?.front_default || p.sprite,
      stats: p.stats,
      types: p.types,
    }));


    const newTeam = { name: teamName, pokemons: slimmedTeam };

    try {
      const existing = JSON.parse(localStorage.getItem("savedTeams")) || [];
      localStorage.setItem("savedTeams", JSON.stringify([...existing, newTeam]));
      toast.success("Team Saved! ✅");
      setTeam([]);
      setTeamName("");
      setIsModalOpen(false);
      router.push("/SavedTeams");
    } catch (err) {
      console.error(err);
      toast.error("Error saving team.");
    }
  };

  return (
      <div className="min-h-screen text-white flex">
        <Navbar />
        <div className="flex-1 z-10 p-6">
          <div className="grid ms-63 grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-3xl font-bold mb-6">Pokémon Team Builder</h1>

              <Filter generation={generation} setGeneration={setGeneration} />
              <SearchBar
                  value={search}
                  onChange={setSearch}
                  suggestions={suggestions}
                  onSelect={addPokemon}
              />



              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                {visiblePokemon.map((pokemon, index) => {
                  const isLast = index === visiblePokemon.length - 1;
                  return (
                      <div
                          key={index}
                          ref={isLast ? lastPokemonRef : null}
                          className="p-4 rounded-lg flex bg-white/5 backdrop-blur-md border border-white/20 shadow-lg flex-col items-center cursor-pointer"
                          onClick={() => addPokemon(pokemon.name)}
                      >
                        <div className="w-25 h-25 flex items-center justify-center overflow-hidden">
                          <Image
                              src={
                                pokemon.name === "missingno"
                                    ? "/missingno.png"
                                    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
                              }
                              alt={pokemon.name}
                              width={80}
                              height={80}
                              className="object-contain"
                          />
                        </div>

                        <h2 className="text-xl font-bold">{pokemon.name.toUpperCase()}</h2>
                      </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="fixed top-8">
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h2 className="text-2xl font-bold">Your Team</h2>

                    {team.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <button
                              onClick={() => setIsModalOpen(true)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                          >
                            Save team
                          </button>
                          <button
                              onClick={resetTeam}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                          >
                            Reset team
                          </button>
                          <button
                              onClick={() => {
                                localStorage.setItem("currentTeam", JSON.stringify(team));
                                router.push("/TeamSummary");
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                          >
                            Go to team summary
                          </button>
                        </div>
                    )}
                  </div>
                </div>

                <TeamModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    teamName={teamName}
                    setTeamName={setTeamName}
                    onSave={saveTeam}
                />

                {team.length === 0 ? (
                    <p className="text-gray-400">No Pokémon in the team yet.</p>
                ) : (
                    <div className="flex flex-wrap gap-4">
                      {team.map((pokemon, i) => (
                          <PokemonCard key={i} pokemon={pokemon} onRemove={removePokemon} />
                      ))}
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
