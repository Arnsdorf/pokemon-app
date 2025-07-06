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

    const selectedGen = generations.find((g) => g.id === generation);

    if (generation !== "all" && selectedGen) {
      filtered = filtered.filter(
          (pokemon) =>
              pokemon.id >= selectedGen.start && pokemon.id <= selectedGen.end
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
      sprite: p.sprites?.front_default || p.sprite,
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

  const formatSpriteName = (name) => {
    return name
        .toLowerCase()
        .replace(/\s/g, "")      // fjern mellemrum
        .replace("♀", "f")       // kvindelige symboler → 'f'
        .replace("♂", "m")       // mandlige symboler → 'm'
        .replace(/[-.]/g, "")    // fjern bindestreger og punktummer
  };



  const getSpriteUrl = (pokemon) => {
    const id = pokemon.id;
    const name = formatSpriteName(pokemon.name);
    const spriteUrl = `https://play.pokemonshowdown.com/sprites/gen1/${name}.png`;


    if (name === "missingno") {
      return "https://play.pokemonshowdown.com/sprites/gen1/missingno.png";
    }

    if (id >= 1 && id <= 151) {
      return `https://play.pokemonshowdown.com/sprites/gen1/${name}.png`;
    }

    if (id >= 152 && id <= 251) {
      return `https://play.pokemonshowdown.com/sprites/gen2/${name}.png`;
    }

    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  };


  return (
      <div className="min-h-screen md:ml-70 font-sans text-white flex">

        <div className="flex-1 z-10 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-3xl font-bold mb-6" >Pokémon Team Builder</h1>



              <Filter generation={generation} setGeneration={setGeneration}/>
              <SearchBar
                  value={search}
                  onChange={setSearch}
                  suggestions={suggestions}
                  onSelect={addPokemon}
              />


              <div className="grid md-grid-cols-2 grid-cols-3 gap-4 mt-6">

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
                          {pokemon.name.toLowerCase() === "missingno" ? (
                              <img
                                  src="https://play.pokemonshowdown.com/sprites/gen1/missingno.png"
                                  alt="MissingNo"
                                  className="w-20 h-20 object-contain"
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

                        </div>

                        <h2 className="text-sm md:text-lg">{pokemon.name.toUpperCase()}</h2>
                      </div>
                  );
                })}
              </div>
            </div>

            <div className="relative md:static ">
              <div
                  className="fixed bottom-0 left-0 w-full h-4.5/10 bg-black/20 backdrop-blur md:backdrop-blur-none border-t border-white/20 md:border-none p-4 z-50 overflow-y-auto md:static md:h-auto md:bg-transparent md:p-0 md:overflow-visible">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-2xl font-bold">Your Team</h2>

                    {team.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
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
                      <div
                          className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3 transition-transform duration-300 place-content-center lg:grid-cols-2 xl:grid-cols-4">

                        {team.map((pokemon, i) => (
                            <PokemonCard key={i} pokemon={pokemon} onRemove={removePokemon}/>
                        ))}
                      </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
  );
}
