// src/components/MissingNoVariants.js

export default function MissingNoVariants() {
    const missingnoForms = [
        //{
            //name: "MissingNo",
            //url: "https://play.pokemonshowdown.com/sprites/gen1/missingno.png",
        //},
        {
            name: "Kabutops Fossil",
            url: "https://play.pokemonshowdown.com/sprites/gen1/missingno-kabutops.png",
        },
        {
            name: "Aerodactyl Fossil",
            url: "https://play.pokemonshowdown.com/sprites/gen1/missingno-aerodactyl.png",
        },
        {
            name: "Ghost",
            url: "https://play.pokemonshowdown.com/sprites/gen1/missingno-ghost.png",
        },
        {
            name: "Yellow",
            url: "https://play.pokemonshowdown.com/sprites/gen1/missingno-yellow.png",
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4">
            {missingnoForms.map((form, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                    <img
                        src={form.url}
                        alt={form.name}
                        className="w-24 h-24 object-contain"
                    />
                    <p className="text-sm text-white">{form.name}</p>
                </div>
            ))}
        </div>
    );
}
