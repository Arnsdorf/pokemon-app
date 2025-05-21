import { useEffect, useState } from "react";

export default function TeamStats({ team = [] }) {

    const [fullTeamData, setFullTeamData] = useState([]);
    const [loading, setLoading] = useState(true);


    const PokeballLoader = () => {
        return (
            <div className="flex justify-center py-10">
                <div className="relative w-16 h-16 animate-spin">
                    <div className="absolute inset-0 bg-white rounded-full border-4 border-black"></div>
                    <div className="absolute inset-0 rounded-full border-t-8 border-red-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white border-2 border-black rounded-full z-10"></div>
                    </div>
                </div>
            </div>
        );
    };


    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const promises = team
                .filter((pokemon) => pokemon !== null)
                .map(async (pokemon) => {
                    if (!pokemon.stats) {
                        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
                        return res.json();
                    }
                    return pokemon;
                });

            const data = await Promise.all(promises);
            setFullTeamData(data);
            setLoading(false);
        };

        if (Array.isArray(team) && team.some(p => p)) {
            fetchStats();
        }


    }, [team]);


    if (!team.some(p => p)) return null;



    if (loading) {
        return <PokeballLoader />;
    }


    const calculateAverageStats = () => {
        const totals = {
            hp: 0,
            attack: 0,
            defense: 0,
            "special-attack": 0,
            "special-defense": 0,
            speed: 0,
        };

        fullTeamData.forEach((pokemon) => {
            if (!pokemon?.stats) return; // sikkerhed
            pokemon.stats.forEach((stat) => {
                const name = stat.stat.name;
                const value = stat.base_stat;
                if (totals[name] !== undefined) {
                    totals[name] += value;
                }
            });
        });

        const averages = {};
        const count = fullTeamData.filter(p => p?.stats).length;

        for (const key in totals) {
            averages[key] = count > 0 ? Math.round(totals[key] / count) : 0;
        }

        return averages;
    };

    const stats = calculateAverageStats();

    const getColor = (value) => {
        if (value >= 130) return "bg-emerald-600";
        if (value >= 110) return "bg-green-500";
        if (value >= 90) return "bg-lime-400";
        if (value >= 70) return "bg-yellow-400";
        if (value >= 60) return "bg-orange-400";
        if (value >= 40) return "bg-red-400";
        return "bg-red-600";
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
            <h3 className="text-2xl font-semibold mb-4">Average Stats</h3>
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
