import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchIssues } from "../lib/api";
import IssueCard from "../components/IssueCard";

export default function Home() {
  const [skills, setSkills] = useState("python, flask");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  async function onSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setHasSearched(true);
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
    navigate(`/issue/${owner}/${repo}/${number}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50">
      {/* Compact Header */}
      <header className="bg-white/70 backdrop-blur-sm border-b border-white/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-800 bg-clip-text text-transparent">
              FirstFix
            </h1>
            <p className="text-slate-600 mt-2 max-w-xl mx-auto">
              Find beginner-friendly issues that match your skills
            </p>
            
            {/* Feature highlights */}
            <div className="flex justify-center gap-6 mt-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Personalized matches
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Starter kits included
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                Beginner-friendly
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Section - More Compact */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg shadow-blue-100/20 p-6 mb-8">
          <form onSubmit={onSearch} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                What technologies do you know?
              </label>
              <div className="relative">
                <input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g., python, react, javascript, rust..."
                  className="w-full rounded-xl border-0 bg-slate-50/80 px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-300/50 focus:outline-none transition-all duration-300"
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-medium shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-200/60 focus:ring-4 focus:ring-blue-200/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600">
                  <div className="flex items-center justify-center h-full">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Searching for perfect matches...
                  </div>
                </div>
              )}
              {!loading && (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Find Perfect Issues
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                Found {results.length} perfect matches
              </h2>
              <div className="flex items-center text-sm text-slate-500">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Ready to contribute
              </div>
            </div>
            
            <div className="grid gap-4">
              {results.map((c, index) => (
                <div
                  key={c.issue.id}
                  className="animate-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <IssueCard card={c} onOpenStarterKit={handleOpenStarterKit} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State - Only show if no search has been performed yet */}
        {!loading && !hasSearched && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Ready when you are!</h3>
            <p className="text-slate-500">Enter your skills above to discover amazing open source opportunities.</p>
          </div>
        )}

        {/* No Results State - Show if search was performed but no results */}
        {!loading && hasSearched && results.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No matches found</h3>
            <p className="text-slate-500 mb-4">Try different skills or technologies to find more issues.</p>
            <button
              onClick={() => {
                setSkills("javascript, react, python");
                setHasSearched(false);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Try popular technologies
            </button>
          </div>
        )}
      </main>
    </div>
  );
}