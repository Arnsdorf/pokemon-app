import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {
    const router = useRouter(); // 👈

    const isActive = (path) => router.pathname === path; // 👈

    return (
        <aside className="w-64 min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-6 flex flex-col space-y-6 shadow-lg backdrop-blur-md">
            <h2 className="text-2xl font-extrabold text-white tracking-wide">Sigurd's Panel</h2>

            <nav className="flex flex-col space-y-3 text-gray-300">
                <Link href="/" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive("/") ? "bg-blue-600 text-white" : "bg-gray-700/70 hover:bg-gray-600/80"}`}>
                    🏠 <span>Dashboard</span>
                </Link>

                <Link href="/savedTeams" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive("/savedTeams") ? "bg-blue-600 text-white" : "bg-gray-700/70 hover:bg-gray-600/80"}`}>
                    📦 <span>Saved Teams</span>
                </Link>

                <Link href="/settings" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive("/settings") ? "bg-blue-600 text-white" : "bg-gray-700/70 hover:bg-gray-600/80"}`}>
                    ⚙️ <span>Settings</span>
                </Link>
            </nav>
        </aside>
    );
}
