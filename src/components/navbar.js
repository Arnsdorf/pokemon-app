import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Home, Save, Settings, GitCompareArrows } from "lucide-react";

export default function Sidebar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkViewport = () => setIsDesktop(window.innerWidth >= 768);
        checkViewport();
        window.addEventListener("resize", checkViewport);
        return () => window.removeEventListener("resize", checkViewport);
    }, []);

    const isActive = (path) =>
        path === "/" ? router.pathname === "/" : router.pathname.startsWith(path);

    const linkClasses = (path) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition 
     ${isActive(path) ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-white/10"}`;

    return (
        <>

            <div
                className={`fixed top-0 left-0 z-40 h-screen w-64 p-6 bg-gray-900/60 backdrop-blur-md shadow-lg transition-transform duration-300 ease-in-out 
        ${isDesktop ? "" : isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {!isDesktop && (
                    <button
                        className="sticky top-2 left-0 z-50 mb-4 bg-gray-900/80 text-white p-2 rounded-full backdrop-blur-md hover:bg-gray-800 transition"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}

                <h2 className="text-2xl font-extrabold text-white mb-6 tracking-wide">
                    Sigurd's Pokémon Team Builder
                </h2>

                <nav className="flex flex-col gap-3">
                    <Link href="/" className={linkClasses("/")}>
                        <Home size={18} />
                        <span>Build Your Team</span>
                    </Link>
                    <Link href="/SavedTeams" className={linkClasses("/SavedTeams")}>
                        <Save size={18} />
                        <span>Saved Teams</span>
                    </Link>
                    <Link href="/CompareTeams" className={linkClasses("/CompareTeams")}>
                        <GitCompareArrows size={18} />
                        <span>Compare Teams</span>
                    </Link>
                    <Link href="/Settings" className={linkClasses("/Settings")}>
                        <Settings size={18} />
                        <span>Settings</span>
                    </Link>
                </nav>
            </div>


            {!isDesktop && !isOpen && (
                <button
                    className="fixed top-4 left-4 z-50 bg-gray-900/80 text-white p-2 rounded-full backdrop-blur-md hover:bg-gray-800 transition"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open sidebar"
                >
                    <ChevronRight size={20} />
                </button>
            )}
        </>
    );
}
