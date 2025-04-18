import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import SearchBar from "./searchBar";
import SavedTeams from "./savedTeams";
import Filter, { generations } from "./Filter";
import TeamModal from "./teamModal";
import toast from "react-hot-toast";




export default function PokemonTeamBuilder() {
  const [team, setTeam] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [generation, setGeneration] = useState("all");
  const [savedTeams, setSavedTeams] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [allPokemon, setAllPokemon] = useState([]);
  const [visiblePokemon, setVisiblePokemon] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(30); // Start med 30

  // Fetch alle Pokémoner
  useEffect(() => {
    const fetchAllPokemon = async () => {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
      const data = await response.json();
      const pokemonList = data.results.map((p, index) => ({ name: p.name, id: index + 1 }));
      setAllPokemon(pokemonList);
      setFilteredPokemon(pokemonList);
    };

    fetchAllPokemon();
  }, []);

  const router = useRouter();



  const goToTeamSummary = () => {
    localStorage.setItem("currentTeam", JSON.stringify(team));
    router.push("./teamSummary");
  };

  // Filtrering baseret på søgning og generation
  useEffect(() => {
    let filtered = allPokemon;

    if (search.length > 0) {
      filtered = filtered.filter(pokemon =>
          pokemon.name.startsWith(search.toLowerCase())
      );
    }

    if (generation !== "all") {
      filtered = filtered.filter(pokemon =>
          pokemon.id >= generations[generation].start &&
          pokemon.id <= generations[generation].end
      );
    }

    setFilteredPokemon(filtered);
    setItemsToShow(30);
    setVisiblePokemon(filtered.slice(0, 30));
  }, [search, generation, allPokemon]);

  // Opdater synlige Pokémoner baseret på hvor mange der skal vises
  useEffect(() => {
    setVisiblePokemon(filteredPokemon.slice(0, itemsToShow));
  }, [filteredPokemon, itemsToShow]);

  // Observer for infinite scroll
  const observer = useRef();
  const lastPokemonRef = useCallback(
      (node) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            setItemsToShow((prev) => prev + 20);
          }
        });
        if (node) observer.current.observe(node);
      },
      []
  );

  // Tilføj Pokémon til team
  const addPokemon = async (pokemonName) => {
    if (!pokemonName || team.length >= 6) return;
    if (team.find(p => p.name === pokemonName)) return;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    if (!response.ok) return;

    const data = await response.json();
    setTeam([...team, data]);
    setSearch("");
    setSuggestions([]);
  };

  // Fjern Pokémon fra team
  const removePokemon = (pokemonName) => {
    const updatedTeam = team.filter(p => p.name !== pokemonName);
    setTeam(updatedTeam);
  };

  // Nulstil hele teamet
  const resetTeam = () => {
    setTeam([]);
  };

  // Gem team
  const saveTeam = () => {
    if (teamName.trim() === "" || team.length === 0) {
      toast.error("Udfyld holdnavn og vælg mindst 1 Pokémon");
      return;
    }

    // Lav slanket version af team
    const slimmedTeam = team.map((pokemon) => ({
      name: pokemon.name,
      sprite: pokemon.sprites.front_default,
      stats: pokemon.stats,
      types: pokemon.types,
    }));

    const newTeam = {
      name: teamName,
      pokemons: slimmedTeam,
    };

    try {
      const existingTeams = JSON.parse(localStorage.getItem("savedTeams")) || [];
      const updatedTeams = [...existingTeams, newTeam];

      localStorage.setItem("savedTeams", JSON.stringify(updatedTeams));
      toast.success("Hold gemt! ✅");

      setTeam([]);
      setTeamName("");
      setIsModalOpen(false);

      router.push("/savedTeams");
    } catch (e) {
      console.error("Kunne ikke gemme hold:", e);
      toast.error("Der opstod en fejl under gemning.");
    }
  };


  return (
      <div className="min-h-screen bg-gray-900 text-white flex">
        <Navbar />
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Venstre kolonne */}
            <div>
              <h1 className="text-3xl font-bold mb-6">Pokémon Team Builder</h1>

              <Filter generation={generation} setGeneration={setGeneration} />
              <SearchBar
                  search={search}
                  setSearch={setSearch}
                  suggestions={suggestions}
                  addPokemon={addPokemon}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                {visiblePokemon.map((pokemon, index) => {
                  const isLast = index === visiblePokemon.length - 1;
                  return (
                      <div
                          key={index}
                          ref={isLast ? lastPokemonRef : null}
                          className="bg-gray-800 p-4 rounded-lg flex flex-col items-center cursor-pointer hover:bg-gray-700"
                          onClick={() => addPokemon(pokemon.name)}
                      >
                        <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                            alt={pokemon.name}
                            className="w-20 h-20 mb-2"
                        />
                        <h2 className="text-xl font-bold">
                          {pokemon.name.toUpperCase()}
                        </h2>
                      </div>
                  );
                })}
              </div>
            </div>

            {/* Højre kolonne */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Team</h2>


                {team.length > 0 && (
                    <div className="flex gap-2 mb-4">

                      <button
                          onClick={() => setIsModalOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Gem hold
                      </button>
                      <button
                          onClick={resetTeam}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Nulstil hold
                      </button>
                      <button
                          onClick={goToTeamSummary}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Vis stats
                      </button>
                    </div>
                )}
                {team.length > 0 && (
                    <div className="mt-6">
                      <button
                          onClick={goToTeamSummary}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Gå til holdoversigt
                      </button>
                    </div>
                )}

              </div>

              <TeamModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  teamName={teamName}
                  setTeamName={setTeamName}
                  onSave={saveTeam}
              />


              {team.length === 0 ? (
                  <p className="text-gray-400">Ingen Pokémon i teamet endnu.</p>
              ) : (
                  <div className="flex flex-wrap gap-4">
                    {team.map((pokemon, i) => (
                        <div
                            key={i}
                            className="bg-gray-700 p-4 rounded-xl shadow flex flex-col items-center"
                        >
                          <img
                              src={pokemon.sprite}
                              alt={pokemon.name}
                              className="w-20 h-20 mb-2"
                          />
                          <p className="font-bold capitalize">{pokemon.name}</p>


                          <p className="text-sm text-gray-400">
                            {pokemon.types.map((t) => t.type.name).join(" / ")}
                          </p>

                        </div>
                    ))}

                  </div>
              )}

            </div>
          </div>
        </div>
      </div>
  );
}
