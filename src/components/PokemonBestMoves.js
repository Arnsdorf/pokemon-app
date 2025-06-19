import { useEffect, useState } from "react";
import { typeColors } from "@/lib/utils";
import customPokemon from "@/lib/CustomPoke";

export default function PokemonBestMoves({ name }) {
    const [moves, setMoves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBestMoves = async () => {
            try {
                // 👉 Hent fra custom data, hvis det er MissingNo
                if (name.toLowerCase() === "missingno") {
                    const customMoves = customPokemon.missingno.moves.map((m) => ({
                        name: m.move.name,
                        power: m.power ?? "–",
                        accuracy: m.accuracy ?? "–",
                    }));
                    setMoves(customMoves);
                    return;
                }

                // 🔽 Ellers hent fra API
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
                const data = await res.json();

                const levelUpMoves = data.moves.filter((m) =>
                    m.version_group_details.some(
                        (v) =>
                            v.move_learn_method.name === "level-up" &&
                            v.version_group.name === "sword-shield"
                    )
                );

                const detailedMoves = await Promise.all(
                    levelUpMoves.map(async (m) => {
                        const res = await fetch(m.move.url);
                        return await res.json();
                    })
                );

                const best = detailedMoves
                    .filter((m) => m.power)
                    .sort((a, b) => b.power - a.power)
                    .slice(0, 4);

                setMoves(best);
            } catch (err) {
                setError("Kunne ikke hente moves.");
            } finally {
                setLoading(false);
            }
        };

        if (name) loadBestMoves();
    }, [name]);

    if (loading) return <p className="text-gray-400 text-sm">Indlæser moves...</p>;
    if (error) return <p className="text-red-400 text-sm">{error}</p>;

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-inner p-4 h-full flex flex-col justify-between">
            <h4 className="font-semibold text-white mb-2">Moveset</h4>

            <table className="w-full table-auto text-sm">
                <thead>
                <tr className="text-gray-300 uppercase tracking-wider text-left text-xs">
                    <th className="py-1">Move</th>
                    <th className="text-center">Pow</th>
                    <th className="text-center">Acc</th>
                </tr>
                </thead>
                <tbody>
                {moves.map((move) => (
                    <tr
                        key={move.name}
                        className="even:bg-white/5 odd:bg-white/10 text-white"
                    >
                        <td className="py-1 capitalize">{move.name.replace("-", " ")}</td>
                        <td className="text-center">{move.power ?? "–"}</td>
                        <td className="text-center">{move.accuracy ?? "–"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
