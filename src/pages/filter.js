export const generations = [
    { id: "all", label: "All Generations", start: 1, end: 898 },
    { id: "gen1", label: "Generation 1", start: 1, end: 151 },
    { id: "gen2", label: "Generation 2", start: 152, end: 251 },
    { id: "gen3", label: "Generation 3", start: 252, end: 386 },
    { id: "gen4", label: "Generation 4", start: 387, end: 493 },
    { id: "gen5", label: "Generation 5", start: 494, end: 649 },
    { id: "gen6", label: "Generation 6", start: 650, end: 721 },
    { id: "gen7", label: "Generation 7", start: 722, end: 809 },
    { id: "gen8", label: "Generation 8", start: 810, end: 898 },
];


export default function Filter({ generation, setGeneration }) {
    return (
        <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-white tracking-wide">
                Filter by Generation:
            </label>
            <select
                value={generation}
                onChange={(e) => setGeneration(e.target.value)}
                className="w-full sm:w-64 p-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition hover:bg-white/20"
            >
                {generations.map(({ id, label, start, end }) => (
                    <option
                        key={id}
                        value={id}
                        className="bg-black text-white"
                    >
                        {label} ({start}-{end})
                    </option>
                ))}
            </select>
        </div>
    );
}

