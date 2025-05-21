import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"


export const typeColors = {
  normal: "bg-gray-400 text-black",
  fire: "bg-orange-500 text-white",
  water: "bg-blue-500 text-white",
  electric: "bg-yellow-400 text-black",
  grass: "bg-green-500 text-white",
  ice: "bg-cyan-300 text-black",
  fighting: "bg-red-700 text-white",
  poison: "bg-purple-600 text-white",
  ground: "bg-yellow-700 text-white",
  flying: "bg-indigo-300 text-black",
  psychic: "bg-pink-500 text-white",
  bug: "bg-lime-500 text-black",
  rock: "bg-yellow-800 text-white",
  ghost: "bg-indigo-700 text-white",
  dragon: "bg-purple-800 text-white",
  dark: "bg-gray-800 text-white",
  steel: "bg-gray-500 text-white",
  fairy: "bg-pink-300 text-black",
};



export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
