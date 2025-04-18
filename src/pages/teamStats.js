import {useState} from "react";
import TeamModal from "./teamModal";

export default function TeamStats({ team }) {
    if (!team || team.length === 0) return null;

    const calculateAverageStats = () => {
        const totals = {
            hp: 0,
            attack: 0,
            defense: 0,
            "special-attack": 0,
            "special-defense": 0,
            speed: 0,
        };

        team.forEach((pokemon) => {
            pokemon.stats.forEach((stat) => {
                const name = stat.stat.name;
                const value = stat.base_stat;
                if (totals[name] !== undefined) {
                    totals[name] += value;
                }
            });
        });

        const averages = {};
        for (const key in totals) {
            averages[key] = Math.round(totals[key] / team.length);
        }

        return averages;
    };



    const stats = calculateAverageStats();

    const getColor = (value) => {
        if (value >= 130) return "bg-emerald-600";     // Super elite stats
        if (value >= 110) return "bg-green-500";       // Meget højt
        if (value >= 90) return "bg-lime-400";        // Over gennemsnittet
        if (value >= 70)  return "bg-yellow-400";      // Gennemsnitligt
        if (value >= 60)  return "bg-orange-400";      // Under gennemsnittet
        if (value >= 40)  return "bg-red-400";         // Lavt
        return "bg-red-600";                           // Meget lavt
    };


    const statLabels = {
        hp: "HP",
        attack: "Attack",
        defense: "Defense",
        "special-attack": "Sp. Atk",
        "special-defense": "Sp. Def",
        speed: "Speed",
    };

    const statEntries = Object.entries(stats);
    const total = statEntries.reduce((acc, [, value]) => acc + value, 0);

    return (
        <div className="bg-gray-800 rounded-xl p-6 space-y-3">
            <h3 className="text-2xl font-semibold mb-4">Gennemsnitlige Stats</h3>
            <table className="w-full text-sm">
                <tbody>
                {statEntries.map(([key, value]) => (
                    <tr key={key} className="align-middle h-8">
                        <td className="w-1/5 capitalize text-gray-300">{statLabels[key]}</td>
                        <td className="w-10 text-right font-semibold pr-2 text-white">{value}</td>
                        <td className="w-full">
                            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`${getColor(value)} h-full transition-all`}
                                    style={{ width: `${(value / 150) * 100}%` }}
                                />
                            </div>
                        </td>
                    </tr>
                ))}
                <tr className="pt-2 border-t border-gray-600 mt-2">
                    <td className="pt-3 text-white font-bold">Total</td>
                    <td className="pt-3 text-white font-bold text-right pr-2">{total}</td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
