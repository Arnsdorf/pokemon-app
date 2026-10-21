"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

const DEFAULT_BACKGROUND = "pokemon_gold_silver.webp";

export default function Layout({ children }) {
    const [background, setBackground] = useState(DEFAULT_BACKGROUND);

    useEffect(() => {
        const saved = localStorage.getItem("background");
        if (saved) setBackground(saved);
    }, []);

    return (
        <div className="relative min-h-screen text-white overflow-hidden flex">

            {/* Background */}
            <img
                loading="eager"
                src={background}
                alt=""
                className="fixed inset-0 w-full h-full object-cover opacity-50 scale-x-[-1] z-0 pointer-events-none"
            />

            {/* Navbar */}
            <div className="relative z-20">
                <Navbar />
            </div>

            {/* Page Content */}
            <main className="relative z-10 flex-1">
                {children}
            </main>

        </div>
    );
}