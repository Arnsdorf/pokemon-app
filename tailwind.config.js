/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
        "./src/app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                scaleIn: 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                scaleIn: {
                    '0%': { opacity: 0, transform: 'scale(0.95)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                poke: ['var(--font-inter)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
