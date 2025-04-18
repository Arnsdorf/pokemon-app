import { useEffect } from "react";
import { Input } from "@/components/ui/input";

export default function TeamModal({ isOpen, onClose, teamName, setTeamName, onSave }) {
    useEffect(() => {
            if (isOpen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }

            return () => {
                document.body.style.overflow = "";
            };
        }, [isOpen]);

    if (!isOpen) return null;



    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-gray-800 text-white rounded-xl p-6 w-full max-w-md mx-auto shadow-xl animate-scaleIn">
                <h2 className="text-xl font-bold mb-4">Navngiv dit hold</h2>

                <Input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="F.eks. Team Pikachu"
                />


                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                    >
                        Annuller
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
                    >
                        Gem
                    </button>
                </div>
            </div>
        </div>
    );
}
