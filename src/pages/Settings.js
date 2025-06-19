import Navbar from "@/components/navbar";

const backgrounds = [
    { name: "Gold/Silver", path: "pokemon_gold_silver.webp" },
    { name: "Crystal", path: "suicune.webp" },
    { name: "Classic", path: "  pokemonGoldSilver.webp" },
];

export default function Settings() {
    const handleBackgroundChange = (path) => {
        localStorage.setItem("background", path);
        window.location.reload(); // eller brug router.reload()
    };

    return (
        <div className="max-w-xl ms-75 py-10 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Choose Background</h1>
            <Navbar />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {backgrounds.map((bg) => (
                    <button
                        key={bg.name}
                        onClick={() => handleBackgroundChange(bg.path)}
                        className="rounded-lg overflow-hidden border-2 border-white/20 hover:border-blue-500 transition"
                    >
                        <img src={bg.path} alt={bg.name} loading="lazy"  className="w-full h-32 scale-x-[-1] object-bottom" />
                        <div className="text-center py-2 bg-black/50">{bg.name}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
