

const backgrounds = [
    { name: "Gold/Silver", path: "pokemon_gold_silver.webp" },
    { name: "Crystal", path: "suicune.webp" },
    { name: "Classic", path: "pokemonGoldSilver.webp" },
    { name: "Scyther", path: "scyther.png" },
    { name: "Suicunejohto", path: "suicunejohto.png" },
    { name: "pinsir", path: "pinsir.png" },
];

export default function Settings() {
    const handleBackgroundChange = (path) => {
        localStorage.setItem("background", path);
        window.location.reload();
    };

    return (
        <div className="flex min-h-screen md:mx-50 text-white">

            <div className="flex-1 px-4 py-10">
                <div className="max-w-5xl mx-auto space-y-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white text-center sm:text-left">
                        Choose Background
                    </h1>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                        {backgrounds.map((bg) => (
                            <button
                                key={bg.name}
                                onClick={() => handleBackgroundChange(bg.path)}
                                className="rounded-lg overflow-hidden border-2 border-white/20 hover:border-blue-500 transition group"
                            >
                                <img
                                    src={bg.path}
                                    alt={bg.name}
                                    className="w-full h-24 sm:h-32 object-cover scale-x-[-1] group-hover:brightness-110"
                                />
                                <div className="text-center py-1 text-sm sm:text-base bg-black/50">
                                    {bg.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
}
