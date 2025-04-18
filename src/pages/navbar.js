import Link from "next/link";

export default function Navbar() {
    return (
        <aside className="w-64 bg-gray-800 p-6 flex flex-col space-y-4">
            <h2 className="text-xl font-bold">Sigurd's Pokemon Panel</h2>
            <nav className="flex flex-col space-y-2">
                <Link href="/" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
                    Dashboard
                </Link>
                <Link href="/savedTeams" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
                    Saved Teams
                </Link>
                <Link href="/settings" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
                    Settings
                </Link>
            </nav>
        </aside>
    );
}
