import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar"; // Sørg for korrekt sti

export default function Layout({ children }) {
    const [background, setBackground] = useState("/pokemon_gold_silver.webp");

    useEffect(() => {
        const saved = localStorage.getItem("background");
        if (saved) setBackground(saved);
    }, []);

    return (
        <div className="relative min-h-screen text-white overflow-hidden flex">
            {/* Baggrund */}
            <img
                loading="lazy"
                src={background}
                alt="Background"
                className="fixed inset-0 w-full h-full object-cover opacity-50 scale-x-[-1] z-0 pointer-events-none"
            />

            {/* Navbar */}
            <div className="relative z-20">
                <Navbar />
            </div>

            {/* Page Content */}
            <main className="relative z-10 flex-1">{children}</main>
        </div>
    );
}
