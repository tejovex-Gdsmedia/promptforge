"use client";
import { useState, useEffect, useCallback } from "react";
import { Trash2, Copy, Clock, ChevronDown, ChevronUp, Search, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import GlassCard from "@/components/shared/GlassCard";
import NoiseOverlay from "@/components/shared/NoiseOverlay";
import FolderSidebar from "@/components/shared/FolderSidebar";
import { useUIStore } from "@/lib/store/uiStore";

interface Prompt {
  id: string;
  input: string;
  output: string;
  profession: string;
  folder_id: string | null;
  is_optimized: boolean;
  created_at: string;
}

export default function HistoryPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { activeFolder, activeProfession, setFolders } = useUIStore();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [promptsRes, foldersRes] = await Promise.all([
        fetch("/api/prompts?limit=100", { credentials: "include" }),
        fetch("/api/folders", { credentials: "include" })
      ]);
      const [promptsData, foldersData] = await Promise.all([
        promptsRes.json(),
        foldersRes.json()
      ]);
      setPrompts(promptsData.prompts || []);
      setFolders(foldersData.folders || []);
    } catch {
      toast.error("Failed to load history data");
    } finally {
      setLoading(false);
    }
  }, [setFolders]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/prompts?id=${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setPrompts(prev => prev.filter(p => p.id !== id));
        toast.success("Prompt deleted");
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered = prompts.filter(p => {
    const matchesSearch = !searchQuery ||
      p.input.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.output.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.profession.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = !activeFolder || p.folder_id === activeFolder.id;
    const matchesProfession = !activeProfession || p.profession === activeProfession || (activeProfession === "Uncategorized" && !p.profession);
    return matchesSearch && matchesFolder && matchesProfession;
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-void text-text-primary overflow-x-hidden">
      <Toaster theme="dark" position="top-right" />
      <NoiseOverlay />
      <div className="flex flex-col lg:flex-row gap-8 pt-28 max-w-7xl mx-auto px-6 pb-20">
        <FolderSidebar prompts={prompts} />
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-medium mb-2">History</h1>
            <p className="text-text-secondary">Search, filter, and restore your past forged prompts.</p>
          </div>

          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-deep border border-glass-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-glow focus:ring-1 focus:ring-glow transition-all"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
            </div>
          ) : filtered.length === 0 ? (
            <GlassCard className="p-10 text-center">
              <p className="text-text-muted text-lg">
                {prompts.length === 0
                  ? "No prompts yet. Head to the Forge to create your first one!"
                  : "No matching prompts found."}
              </p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {filtered.map((prompt) => (
                <GlassCard key={prompt.id} className="p-5 hover:border-glow/30 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-text-secondary">
                          {prompt.profession}
                        </span>
                        {prompt.is_optimized && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">
                            Optimized
                          </span>
                        )}
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(prompt.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-text-primary truncate">{prompt.input}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setExpandedId(expandedId === prompt.id ? null : prompt.id)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-text-muted"
                        title="Expand"
                      >
                        {expandedId === prompt.id
                          ? <ChevronUp className="w-4 h-4" />
                          : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(prompt.output);
                          toast.success("Copied to clipboard!");
                        }}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-text-muted"
                        title="Copy output"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prompt.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-text-muted hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {expandedId === prompt.id && (
                    <div className="mt-4 pt-4 border-t border-glass-border">
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Input</span>
                          <p className="text-sm text-text-secondary mt-1">{prompt.input}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Output</span>
                          <div className="mt-1 p-4 rounded-xl bg-deep/50 border border-glass-border text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                            {prompt.output}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
