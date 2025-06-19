const customPokemon = {
    missingno: {
        name: "missingno",
        id: "000",
        sprites: {
            front_default: "/missingno.png",
        },
        stats: [
            { base_stat: 33, stat: { name: "hp" } },
            { base_stat: 136, stat: { name: "attack" } },
            { base_stat: 0, stat: { name: "defense" } },
            { base_stat: 6, stat: { name: "special-attack" } },
            { base_stat: 6, stat: { name: "special-defense" } },
            { base_stat: 29, stat: { name: "speed" } },
        ],
        types: [
            { type: { name: "bird" } },
            { type: { name: "normal" } },
        ],
        abilities: [
            { ability: { name: "glitch-boost" }, is_hidden: false },
        ],
        height:
            10,
        weight:
            3507.2,
        moves: [
            {
                move: { name: "water-gun" },
                version_group_details: [
                    {
                        move_learn_method: { name: "glitch" },
                        version_group: { name: "red-blue" },
                        level_learned_at: 1,
                    },
                ],
                power: 40,
                accuracy: 100,
            },
            {
                move: { name: "sky-attack" },
                version_group_details: [
                    {
                        move_learn_method: { name: "glitch" },
                        version_group: { name: "red-blue" },
                        level_learned_at: 1,
                    },
                ],
                power: 140,
                accuracy: 90,
            },
        ],
        species: {
            flavor_text_entries: [
                {
                    flavor_text:
                        "MissingNo. is a Bird-type Glitch Pokémon from Generation 1. For a time, MissingNo. was thought to be an unused Legendary Pokémon, and later a Poké God.",
                    language: { name: "en" },
                },
            ],
            url: null,
        },
    },
};

export default customPokemon;
