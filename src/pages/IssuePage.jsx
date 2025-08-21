// frontend/src/pages/IssuePage.jsx - Clean Vertical Layout with Theme
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStarterKit } from "../lib/api";
import Section from "../components/Section";
import { InlineCode, BlockCode } from "../components/Code";

function ghLinkify(text, { owner, repo, sha }) {
  if (!text) return text;
  return text.replace(/\(([^\s()]+):\s*(\d+)[ÃƒÆ'Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬"-](\d+)\)/g, (m, path, s, e) => {
    const base = `https://github.com/${owner}/${repo}/blob/${sha || "main"}/${path}`;
    const url = sha ? `${base}#L${s}-L${e}` : base;
    return `(<a href="${url}" target="_blank" rel="noreferrer">${path}:${s}-${e}</a>)`;
  });
}

function summarizeIssue(issue) {
  if (issue?.summary) return issue.summary;
  const body = (issue?.bodyText || "").trim();
  if (!body) return "No description provided by the repository. Read the issue carefully on GitHub.";
  const firstPara = body.split(/\n{2,}/)[0];
  const trimmed = firstPara.slice(0, 300);
  return trimmed + (firstPara.length > 300 ? "…" : "");
}

function buildNextSteps(owner, repo, issueNumber) {
  const repoUrl = `https://github.com/${owner}/${repo}`;
  return [
    { t: `Fork the repo on GitHub`, a: repoUrl },
    { t: `Clone your fork locally`, code: `git clone https://github.com/<your-username>/${repo}.git` },
    { t: `Create a new branch`, code: `cd ${repo}\ngit checkout -b fix/issue-${issueNumber}` },
    {
      t: `Install dependencies (adjust to project)`,
      code: `# Python example\npython -m venv .venv\nsource .venv/bin/activate\npip install -r requirements.txt`,
    },
    { t: `Run the project / tests (see run hints below)` },
    { t: `Make the change following the suggestions in "AI Insights"` },
    { t: `Commit & push`, code: `git add -A\ngit commit -m "Fix: ${repo} issue #${issueNumber}"\ngit push -u origin HEAD` },
    { t: `Open a Pull Request referencing #${issueNumber}`, a: `${repoUrl}/compare` },
  ];
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Preparing Your Starter Kit</h2>
            <p className="text-slate-600">Analyzing the issue and gathering insights...</p>
          </div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button 
            onClick={() => navigate(-1)} 
            className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm hover:bg-white/90 px-4 py-2 text-sm mb-4 transition-colors duration-200"
          >
            ← Back
          </button>
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 text-red-700">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Error loading starter kit</span>
            </div>
            <p className="mt-2">{err}</p>
          </div>
        </div>
      </div>
    );
  }

  // Safe destructuring AFTER loading/err guards
  const payload = data || {};
  const respOwner = payload.owner ?? owner;
  const respRepo = payload.repo ?? repo;
  const sha = payload.sha ?? null;

  const issue = payload.issue || {};
  const run_hints = payload.run_hints || [];
  const hints = payload.hints || {
    high_level_goal: "",
    where_to_work: [],
    what_to_change: [],
    how_to_verify: [],
    gotchas: [],
  };
  const hintsFallback = Boolean(payload.hints_fallback);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">Starter Kit</h1>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Open
                  </span>
                  {hintsFallback ? (
                    <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                      Quick Analysis
                    </span>
                  ) : (
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                      Deep Analysis
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm text-slate-600 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-4 0H3m2-5l2-2m0 0l2 2m-2-2v6" />
                  </svg>
                  <span className="font-medium">{respOwner}/{respRepo}</span>
                </div>
                <span>Issue #{issue?.number ?? number}</span>
                {sha && (
                  <>
                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">
                      {String(sha).slice(0, 7)}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href={issue?.url} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-colors duration-200 font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on GitHub
              </a>
              <button 
                onClick={() => navigate(-1)} 
                className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm hover:bg-white/90 px-4 py-2 text-sm transition-colors duration-200"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 pb-16">
        {/* Issue Summary */}
        <div className="mt-6">
          <Section title="What this issue is asking">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-slate-900 mb-2 text-lg">
                  {issue?.title || "Loading issue details..."}
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  {issue?.summary ? "📌 " : ""}{summarizeIssue(issue)}{" "}
                  <a 
                    href={issue?.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                  >
                    Read the full issue ↗
                  </a>
                </p>
              </div>
            </div>
          </Section>
        </div>

        {/* Next Steps */}
        <div className="mt-6">
          <Section title="Next steps to contribute">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-3">Contribution Roadmap</h3>
                <ol className="list-decimal pl-6 text-slate-800 space-y-3">
                  {buildNextSteps(respOwner, respRepo, issue?.number ?? number).map((step, i) => (
                    <li key={i}>
                      <div className="flex flex-col gap-2">
                        <span className="leading-relaxed">
                          {step.t}
                          {step.a && (
                            <>
                              {" — "}
                              <a 
                                className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200" 
                                href={step.a} 
                                target="_blank" 
                                rel="noreferrer"
                              >
                                open ↗
                              </a>
                            </>
                          )}
                        </span>
                        {step.code && <BlockCode>{step.code}</BlockCode>}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Section>
        </div>

        {/* AI Insights */}
        <div className="mt-6">
          <Section title="AI Insights">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-3">Smart guidance to help you succeed</h3>
                
                {hints?.high_level_goal && (
                  <div className="mb-4 p-4 bg-blue-50/80 border border-blue-200/50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-blue-900 font-semibold">🎯 High-level goal:</strong>
                        <p className="text-blue-800 mt-1">{hints.high_level_goal}</p>
                      </div>
                    </div>
                  </div>
                )}

                {Array.isArray(hints?.where_to_work) && hints.where_to_work.length > 0 && (
                  <div className="mb-4">
                    <div className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      🔍 Where to work
                    </div>
                    <ul className="list-disc pl-6 text-slate-700 space-y-1">
                      {hints.where_to_work.map((t, i) => (
                        <li key={`w-${i}`} dangerouslySetInnerHTML={{
                          __html: ghLinkify(t, { owner: respOwner, repo: respRepo, sha })
                        }} />
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(hints?.what_to_change) && hints.what_to_change.length > 0 && (
                  <div className="mb-4">
                    <div className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      ✏️ What to change
                    </div>
                    <ul className="list-disc pl-6 text-slate-700 space-y-1">
                      {hints.what_to_change.map((t, i) => (
                        <li key={`c-${i}`} dangerouslySetInnerHTML={{
                          __html: ghLinkify(t, { owner: respOwner, repo: respRepo, sha })
                        }} />
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(hints?.how_to_verify) && hints.how_to_verify.length > 0 && (
                  <div className="mb-4">
                    <div className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      ✅ How to verify
                    </div>
                    <ul className="list-disc pl-6 text-slate-700 space-y-1">
                      {hints.how_to_verify.map((t, i) => <li key={`v-${i}`}>{t}</li>)}
                    </ul>
                  </div>
                )}

                {Array.isArray(hints?.gotchas) && hints.gotchas.length > 0 && (
                  <div className="mb-4">
                    <div className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                      ⚠️ Gotchas
                    </div>
                    <ul className="list-disc pl-6 text-slate-700 space-y-1">
                      {hints.gotchas.map((t, i) => <li key={`g-${i}`}>{t}</li>)}
                    </ul>
                  </div>
                )}

                {hintsFallback && (
                  <div className="mt-4 p-3 bg-slate-50/80 border border-slate-200/50 rounded-xl">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-xs text-slate-600">
                        <p className="font-medium">Quick analysis mode</p>
                        <p>Generated quickly due to high demand—results may be less specific but still helpful to get you started!</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>
        </div>

        {/* Local Development */}
        <div className="mt-6">
          <Section title="Run locally">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-3">Local development commands</h3>
                {run_hints.length === 0 ? (
                  <div className="p-4 bg-slate-50/80 border border-slate-200/50 rounded-xl text-center">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-slate-700 font-medium text-sm">No run hints detected yet</p>
                    <p className="text-slate-600 text-xs">Check the README and package files for setup instructions.</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {run_hints.map((h, i) => (
                      <li key={i} className="flex items-center gap-3 p-3 bg-slate-50/80 border border-slate-200/50 rounded-xl">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <InlineCode>{h}</InlineCode>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}