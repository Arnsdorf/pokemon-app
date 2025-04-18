export default function Generations({ generation, setGeneration }) {
    const generations = {
        all: { start: 1, end: 898 },
        gen1: { start: 1, end: 151 },
        gen2: { start: 152, end: 251 },
        gen3: { start: 252, end: 386 },
        gen4: { start: 387, end: 493 },
        gen5: { start: 494, end: 649 },
        gen6: { start: 650, end: 721 },
        gen7: { start: 722, end: 809 },
        gen8: { start: 810, end: 898 },
    };

    return (
        <div className="mb-4">

            <select
                value={generation}
                onChange={(e) => setGeneration(e.target.value)}
                className="p-2 bg-gray-800 text-white border border-gray-600 rounded"
            >
                <option value="all">All Generations</option>
                <option value="gen1">Generation 1</option>
                <option value="gen2">Generation 2</option>
                <option value="gen3">Generation 3</option>
                <option value="gen4">Generation 4</option>
                <option value="gen5">Generation 5</option>
                <option value="gen6">Generation 6</option>
                <option value="gen7">Generation 7</option>
                <option value="gen8">Generation 8</option>
            </select>
        </div>
    );
}
