import { useEffect, useState } from "react";
import Image from "next/image";

export default function EvolutionChain({ speciesUrl }) {
    const [chain, setChain] = useState([]);

    
    const getTriggerLabel = (details) => {
        if (!details || !details[0]) return "?";

        const trigger = details[0].trigger?.name;

        if (trigger === "level-up") {
            return details[0].min_level ? `Lvl. ${details[0].min_level}` : "Level up";
        }

        if (trigger === "trade") {
            return "Trade";
        }

        if (trigger === "use-item") {
            return `Use ${details[0].item?.name.replace("-", " ") || "item"}`;
        }

        return trigger.charAt(0).toUpperCase() + trigger.slice(1);
    };

    useEffect(() => {
        const fetchChain = async () => {
            try {
                if (!speciesUrl) return;

                const speciesRes = await fetch(speciesUrl);
                const speciesData = await speciesRes.json();

                const evoRes = await fetch(speciesData.evolution_chain.url);
                const evoData = await evoRes.json();

                const extractChain = async (node, acc = []) => {
                    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${node.species.name}`);
                    const pokemonData = await res.json();

                    acc.push({
                        name: node.species.name,
                        id: pokemonData.id,
                        sprite: pokemonData.sprites.front_default,
                        trigger: getTriggerLabel(node.evolution_details),
                    });

                    if (node.evolves_to.length > 0) {
                        await extractChain(node.evolves_to[0], acc);
                    }

                    return acc;
                };

                const result = await extractChain(evoData.chain);
                setChain(result);
            } catch (err) {
                console.error("Failed to load evolution chain:", err);
                setChain([]);
            }
        };

        fetchChain();
    }, [speciesUrl]);

    const formatSpriteName = (name) => {
        return name
            .toLowerCase()
            .replace(/\s/g, "")      // fjern mellemrum
            .replace("♀", "f")       // kvindelige symboler → 'f'
            .replace("♂", "m")       // mandlige symboler → 'm'
            .replace(/[-.]/g, "")    // fjern bindestreger og punktummer
    };

    const getSpriteUrl = (poke) => {
        if (!poke || !poke.name) return "";

        const id = poke.id;
        const name = formatSpriteName(poke.name);

        if (name === "missingno") {
            return "https://play.pokemonshowdown.com/sprites/gen1/missingno.png";
        }


        if (id >= 1 && id <= 251) {
            return `https://play.pokemonshowdown.com/sprites/gen2/${name}.png`;
        }

        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    };


    if (!chain.length) return <p className="text-sm text-gray-400">No evolution found.</p>;

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {chain.map((poke, index) => (
                <div key={poke.name} className="flex items-center gap-4">
                    <div className="bg-gray-700 rounded-xl p-4 text-center shadow-md w-28 flex flex-col items-center">

                        <Image
                            src={getSpriteUrl(poke)}
                            alt={poke.name}
                            width={55}
                            height={55}
                            className="mb-2"
                        />




                        <p className="capitalize mt-2 text-sm">{poke.name}</p>
                    </div>

                    {index < chain.length - 1 && (
                        <div className="flex flex-col items-center text-xs text-gray-300">
                            <span className="text-2xl">→</span>
                            <span className="text-xs mt-1">{chain[index + 1].trigger || "?"}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
