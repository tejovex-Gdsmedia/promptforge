"use client";

import { Folder, Plus, Check, X } from "lucide-react";
import GlassCard from "./GlassCard";
import { useUIStore } from "@/lib/store/uiStore";
import { useState } from "react";
import { toast } from "sonner";

export default function FolderSidebar({ prompts = [] }: { prompts?: any[] }) {
  const { folders, activeFolder, setActiveFolder, activeProfession, setActiveProfession, setFolders } = useUIStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderProf, setNewFolderProf] = useState("");

  const handleAddField = async () => {
    if (!newFolderName) return;
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName, profession: newFolderProf || null }),
      });
      if (res.ok) {
        const { folder } = await res.json();
        setFolders([...folders, folder]);
        setIsCreating(false);
        setNewFolderName("");
        setNewFolderProf("");
        toast.success("Folder created");
      } else {
        toast.error("Failed to create folder");
      }
    } catch {
      toast.error("Failed to create folder");
    }
  };

  const allProfessions = Array.from(new Set([
    ...folders.map(f => f.profession || "Uncategorized"),
    ...prompts.map(p => p.profession || "Uncategorized")
  ])).sort();

  return (
    <GlassCard className="w-full lg:w-64 lg:shrink-0 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg">Folders</h2>
        <button onClick={() => setIsCreating(true)} className="p-1 hover:bg-white/10 rounded-md">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isCreating && (
        <div className="bg-white/5 p-3 rounded-lg flex flex-col gap-2">
            <input
                placeholder="Folder name"
                className="bg-deep border border-glass-border p-2 rounded text-sm w-full"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
            />
            <input
                placeholder="Profession (optional)"
                className="bg-deep border border-glass-border p-2 rounded text-sm w-full"
                value={newFolderProf}
                onChange={e => setNewFolderProf(e.target.value)}
            />
            <div className="flex justify-end gap-2">
                <button onClick={() => setIsCreating(false)}><X className="w-4 h-4 text-text-muted"/></button>
                <button onClick={handleAddField}><Check className="w-4 h-4 text-green-400"/></button>
            </div>
        </div>
      )}

      <button
        onClick={() => setActiveFolder(null)}
        className={`text-sm w-full text-left p-2 rounded-lg transition-colors ${
          !activeFolder && !activeProfession ? "bg-white/10" : "hover:bg-white/5"
        }`}
      >
        All Prompts ({prompts.length})
      </button>

      <div className="flex flex-col gap-6">
        {allProfessions.map((profession) => {
          const items = folders.filter(f => (f.profession || "Uncategorized") === profession);
          const count = prompts.filter(p => (profession === "Uncategorized" ? !p.profession : p.profession === profession)).length;

          return (
          <div key={profession}>
            <button
              onClick={() => setActiveProfession(profession)}
              className={`text-xs font-medium uppercase tracking-wider mb-2 w-full text-left transition-colors flex justify-between p-1 rounded hover:bg-white/10 ${
                activeProfession === profession ? "text-white bg-white/5" : "text-text-muted hover:text-white"
              }`}
            >
              {profession} ({count})
            </button>
            {items.length > 0 && (
              <div className="flex flex-col gap-2">
                {items.map((folder: any) => (
                  <button
                    key={folder.id}
                    onClick={() => setActiveFolder(folder)}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      activeFolder?.id === folder.id ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <Folder className="w-4 h-4" />
                    {folder.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )})}
      </div>
    </GlassCard>
  );
}
