import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getStarterKit } from "../lib/api";

function ghFileUrl(owner, repo, sha, path, startLine, endLine) {
  // Deep link to GitHub lines: https://github.com/o/r/blob/sha/path#Lstart-Lend
  const lineFrag = startLine && endLine ? `#L${startLine}-L${endLine}` : "";
  return `https://github.com/${owner}/${repo}/blob/${sha}/${path}${lineFrag}`;
}

export default function IssuePage() {
  const { owner, repo, number } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const kit = await getStarterKit(owner, repo, number);
        if (kit.error) throw new Error(kit.error); 
        setData(kit);
      } catch (e) {
        setErr(e.message || "Failed to load starter kit");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [owner, repo, number]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">Loading starter kit…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button onClick={() => navigate(-1)} className="text-sm text-blue-600 underline">
            ← Back
          </button>
          <div className="mt-4 text-red-600">{err}</div>
        </div>
      </div>
    );
  }

  const sha = data?.sha;
  const issue = data?.issue;
  const runHints = data?.run_hints || [];
  const chunks = data?.top_chunks || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Starter Kit</h1>
          <div className="text-sm text-gray-600 mt-1">
            <span className="mr-2">{owner}/{repo}</span>
            <span className="mr-2">Issue #{issue?.number}</span>
            <span className="text-gray-400">SHA {sha?.slice(0, 7)}</span>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="rounded-xl border px-3 py-1.5 text-sm">
          ← Back
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-10">
        {/* Run hints */}
        <section className="bg-white rounded-2xl border p-4">
          <h2 className="font-semibold text-lg">Run locally</h2>
          {runHints.length === 0 ? (
            <p className="text-sm text-gray-600 mt-2">No run hints detected yet.</p>
          ) : (
            <ul className="mt-2 list-disc pl-6 text-sm">
              {runHints.map((h, i) => (
                <li key={i} className="mb-1">
                  <code className="bg-gray-100 rounded px-1 py-0.5">{h}</code>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Files to read (top chunks) */}
        <section className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Files to read first</h2>
          <div className="grid gap-3">
            {chunks.map((c, idx) => (
              <div key={idx} className="bg-white rounded-2xl border p-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <div className="font-mono text-gray-800">{c.path}</div>
                    <div className="text-gray-500">
                      {c.symbol ? <span className="mr-2">symbol: <code>{c.symbol}</code></span> : null}
                      <span>lines {c.start_line}–{c.end_line}</span>
                      {c.kind ? <span className="ml-2 text-xs rounded bg-gray-100 px-2 py-0.5">{c.kind}</span> : null}
                    </div>
                  </div>
                  {sha && (
                    <a
                      className="rounded-xl bg-black text-white px-3 py-1.5 text-sm hover:opacity-90"
                      href={ghFileUrl(owner, repo, sha, c.path, c.start_line, c.end_line)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open on GitHub
                    </a>
                  )}
                </div>
                {c.preview && (
                  <pre className="mt-3 max-h-48 overflow-auto text-sm bg-gray-50 rounded-xl p-3">
                    {c.preview}
                  </pre>
                )}
              </div>
            ))}
            {chunks.length === 0 && <p className="text-sm text-gray-600">No relevant files found yet.</p>}
          </div>
        </section>

        {/* Issue link */}
        {issue?.url && (
          <div className="mt-8">
            <a
              href={issue.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              View original issue on GitHub ↗
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
