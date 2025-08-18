// frontend/src/pages/IssuePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStarterKit } from "../lib/api";
import Section from "../components/Section";
import { InlineCode, BlockCode } from "../components/Code";

function ghLinkify(text, { owner, repo, sha }) {
  if (!text) return text;
  // Turn (path: start–end) or (path: start-end) into clickable <a>…</a>
  return text.replace(/\(([^\s()]+):\s*(\d+)[–-](\d+)\)/g, (m, path, s, e) => {
    const base = `https://github.com/${owner}/${repo}/blob/${sha || "main"}/${path}`;
    const url = sha ? `${base}#L${s}-L${e}` : base; // if sha missing, still open file
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
    { t: `Make the change following the suggestions in "Hints & ideas"` },
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">Loading starter kit…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button onClick={() => navigate(-1)} className="rounded-xl border px-3 py-1.5 text-sm mb-4">
            ← Back
          </button>
          <div className="text-red-600">{err}</div>
        </div>
      </div>
    );
  }

  // ---- Safe destructuring AFTER loading/err guards ----
  const payload = data || {};
  const respOwner = payload.owner ?? owner;
  const respRepo  = payload.repo  ?? repo;
  const sha       = payload.sha   ?? null;

  const issue        = payload.issue || {};
  const run_hints    = payload.run_hints || []; // backend uses snake_case
  const hints        = payload.hints || {
    high_level_goal: "",
    where_to_work: [],
    what_to_change: [],
    how_to_verify: [],
    gotchas: [],
  };
  const hintsFallback = Boolean(payload.hints_fallback);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Starter Kit</h1>
          <div className="text-sm text-gray-600 mt-1">
            <span className="mr-2">{respOwner}/{respRepo}</span>
            <span className="mr-2">Issue #{issue?.number ?? number}</span>
            {sha && <span className="text-gray-400">SHA {String(sha).slice(0, 7)}</span>}
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="rounded-xl border px-3 py-1.5 text-sm">
          ← Back
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-16">
        {/* 1) Issue Summary */}
        <Section title="What this issue is asking">
          <p className="text-sm text-gray-700">
            {issue?.summary ? "📌 " : ""}{summarizeIssue(issue)}{" "}
            <a href={issue?.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              Read the full issue ↗
            </a>
          </p>
        </Section>

        {/* 2) Next Steps (Contribution Flow) */}
        <div className="mt-6">
          <Section title="Next steps to contribute">
            <ol className="list-decimal pl-6 text-sm text-gray-800 space-y-2">
              {buildNextSteps(respOwner, respRepo, issue?.number ?? number).map((step, i) => (
                <li key={i}>
                  <div className="flex flex-col">
                    <span>
                      {step.t}
                      {step.a && (
                        <>
                          {" — "}
                          <a className="text-blue-600 underline" href={step.a} target="_blank" rel="noreferrer">
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
          </Section>
        </div>

        {/* 3) Hints / Ideas (LLM) */}
        <div className="mt-6">
          <Section title="Hints & ideas">
            {hints?.high_level_goal && (
              <div className="mb-3 text-sm text-gray-800">
                <strong>High-level goal:</strong> {hints.high_level_goal}
              </div>
            )}

            {Array.isArray(hints?.where_to_work) && hints.where_to_work.length > 0 && (
              <>
                <div className="font-medium mt-3">Where to work</div>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  {hints.where_to_work.map((t, i) => (
                    <li key={`w-${i}`} dangerouslySetInnerHTML={{
                      __html: ghLinkify(t, { owner: respOwner, repo: respRepo, sha })
                    }} />
                  ))}
                </ul>
              </>
            )}

            {Array.isArray(hints?.what_to_change) && hints.what_to_change.length > 0 && (
              <>
                <div className="font-medium mt-3">What to change</div>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  {hints.what_to_change.map((t, i) => (
                    <li key={`c-${i}`} dangerouslySetInnerHTML={{
                      __html: ghLinkify(t, { owner: respOwner, repo: respRepo, sha })
                    }} />
                  ))}
                </ul>
              </>
            )}

            {Array.isArray(hints?.how_to_verify) && hints.how_to_verify.length > 0 && (
              <>
                <div className="font-medium mt-3">How to verify</div>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  {hints.how_to_verify.map((t, i) => <li key={`v-${i}`}>{t}</li>)}
                </ul>
              </>
            )}

            {Array.isArray(hints?.gotchas) && hints.gotchas.length > 0 && (
              <>
                <div className="font-medium mt-3">Gotchas</div>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  {hints.gotchas.map((t, i) => <li key={`g-${i}`}>{t}</li>)}
                </ul>
              </>
            )}

            {hintsFallback && (
              <div className="mt-3 text-xs text-gray-500">
                Generated quickly due to a slow model response—results may be less specific.
              </div>
            )}
          </Section>
        </div>

        {/* 4) Run hints (from backend heuristics) */}
        <div className="mt-6">
          <Section title="Run locally">
            {run_hints.length === 0 ? (
              <p className="text-sm text-gray-600">No run hints detected yet. Check the README and package files.</p>
            ) : (
              <ul className="mt-2 list-disc pl-6 text-sm">
                {run_hints.map((h, i) => (
                  <li key={i}>
                    <InlineCode>{h}</InlineCode>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        {/* 5) References (optional; generic links only) */}
        {/* You can keep or remove this block as you prefer */}
      </main>
    </div>
  );
}
