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
        <div className="mb-4">
            <label className="mr-2 text-white">Filter by Generation:</label>
            <select
                value={generation}
                onChange={(e) => setGeneration(e.target.value)}
                className="p-2 bg-gray-800 text-white border border-gray-600 rounded"
            >
                {Object.entries(generations).map(([key, { start, end }]) => (
                    <option key={key} value={key}>
                        {key === "all"
                            ? "All Generations"
                            : `Generation ${key.replace("gen", "")} (${start}-${end})`}
                    </option>
                ))}
            </select>
        </div>
    );
}

