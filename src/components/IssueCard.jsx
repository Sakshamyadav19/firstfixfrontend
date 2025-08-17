import React from "react";

export default function IssueCard({ card, onOpenStarterKit }) {
  const repo = card.repo;
  const issue = card.issue;

  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white">
      <div className="flex items-center justify-between">
        <a href={issue.url} target="_blank" className="text-lg font-semibold hover:underline">
          {issue.title}
        </a>
        <span className="text-sm text-gray-500">#{issue.number}</span>
      </div>
      <div className="mt-1 text-sm text-gray-600">
        <a href={repo.url} target="_blank" className="hover:underline">
          {repo.nameWithOwner}
        </a>
        {repo.primaryLanguage && (
          <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs">{repo.primaryLanguage}</span>
        )}
        <span className="ml-2 text-xs text-gray-500">★ {repo.stargazerCount}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {issue.labels.slice(0, 5).map((l) => (
          <span key={l} className="text-xs rounded bg-blue-50 px-2 py-0.5 text-blue-600">
            {l}
          </span>
        ))}
        {repo.topics.slice(0, 5).map((t) => (
          <span key={t} className="text-xs rounded bg-purple-50 px-2 py-0.5 text-purple-600">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Updated: {new Date(issue.updatedAt).toLocaleDateString()}
        </div>
        <button
          onClick={() => onOpenStarterKit?.(card)}
          className="rounded-xl bg-black text-white px-3 py-1.5 text-sm hover:opacity-90"
        >
          Open starter kit
        </button>
      </div>
    </div>
  );
}
