import { useEffect, useRef } from "react";

export default function TeamModal({ isOpen, onClose, teamName, setTeamName, onSave }) {
    const inputRef = useRef(null);

    // Lock scroll on open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            inputRef.current?.focus();
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // ESC to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Prevent rendering if not open
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity">
            <div className="bg-gray-800 text-white rounded-xl p-6 w-full max-w-md mx-auto shadow-xl animate-fade-in">
                <h2 className="text-xl font-bold mb-4">Name your team</h2>

                <label htmlFor="teamName" className="block text-sm text-gray-300 mb-1">
                    Team name
                </label>
                <input
                    id="teamName"
                    ref={inputRef}
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSave()}
                    placeholder="Fx. Team Pikachu"
                    className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
