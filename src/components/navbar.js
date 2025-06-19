import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {
    const router = useRouter();

    const isActive = (path) => {
        if (path === "/") return router.pathname === "/";
        return router.pathname.startsWith(path);
    };


    const linkClasses = (path) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition 
        ${isActive(path) ? "bg-blue-600 text-white" : "bg-gray-700/70 hover:bg-gray-600/80"}`;

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 z-50 bg-black/40 p-6 shadow-lg backdrop-blur-md">
            <h2 className="text-2xl font-extrabold text-white mb-4 tracking-wide">Sigurd's Panel</h2>

            <nav className="flex flex-col space-y-3 text-gray-300">
                <Link href="/" className={linkClasses("/")}>
                    🏠 <span>Dashboard</span>
                </Link>

                <Link href="/SavedTeams" className={linkClasses("/SavedTeams")}>
                    📦 <span>Saved Teams</span>
                </Link>

                <Link href="/Settings" className={linkClasses("/Settings")}>
                    ⚙️ <span>Settings</span>
                </Link>
            </nav>
        </aside>
    );
}
