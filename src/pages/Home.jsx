import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchIssues } from "../lib/api";
import IssueCard from "../components/IssueCard";

export default function Home() {
  const [skills, setSkills] = useState("python, flask");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function onSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const items = await searchIssues(skills);
      setResults(items);
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenStarterKit(card) {
    const [owner, repo] = (card.repo.nameWithOwner || "").split("/");
    const number = card.issue.number;
    if (!owner || !repo || !number) return;
    // Route to our Issue page (replaces current view)
    navigate(`/issue/${owner}/${repo}/${number}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">FirstFix</h1>
        <p className="text-gray-600 mt-1">Find beginner-friendly issues that fit your skills.</p>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        <form onSubmit={onSearch} className="flex gap-2">
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g., python, flask"
            className="flex-1 rounded-xl border px-3 py-2"
          />
          <button
            type="submit"
            className="rounded-xl bg-black text-white px-4 py-2"
            disabled={loading}
          >
            {loading ? "Searching..." : "Find issues"}
          </button>
        </form>

        {error && <div className="mt-4 text-red-600">{error}</div>}

        <div className="mt-6 grid gap-3">
          {results.map((c) => (
            <IssueCard key={c.issue.id} card={c} onOpenStarterKit={handleOpenStarterKit} />
          ))}
        </div>
      </main>
    </div>
  );
}
