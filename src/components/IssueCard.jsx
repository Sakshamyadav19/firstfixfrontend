import React from "react";

export default function IssueCard({ card, onOpenStarterKit }) {
  const repo = card.repo;
  const issue = card.issue;

  return (
    <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-white/60 rounded-3xl p-6 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-500 hover:scale-[1.02] hover:bg-white/90">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <a 
              href={issue.url} 
              target="_blank" 
              rel="noreferrer"
              className="text-xl font-semibold text-slate-800 hover:text-blue-700 transition-colors duration-200 line-clamp-2"
            >
              {issue.title}
            </a>
            <div className="flex items-center gap-3 mt-2">
              <a 
                href={repo.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {repo.nameWithOwner}
              </a>
              <span className="text-slate-400">•</span>
              <span className="text-sm text-slate-500 bg-slate-100/70 px-2 py-1 rounded-lg">
                #{issue.number}
              </span>
            </div>
          </div>
          
          {/* Star count */}
          <div className="flex items-center gap-1 bg-amber-50/80 text-amber-700 px-3 py-1.5 rounded-xl text-sm font-medium ml-4">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            {repo.stargazerCount}
          </div>
        </div>

        {/* Language and updated info */}
        <div className="flex items-center gap-4 mb-4">
          {repo.primaryLanguage && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></div>
              <span className="text-sm font-medium text-slate-700">{repo.primaryLanguage}</span>
            </div>
          )}
          <span className="text-slate-400">•</span>
          <span className="text-sm text-slate-500">
            Updated {new Date(issue.updatedAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {issue.labels.slice(0, 3).map((label) => (
            <span 
              key={label} 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50/80 text-emerald-700 border border-emerald-200/50"
            >
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></div>
              {label}
            </span>
          ))}
          
          {repo.topics.slice(0, 3).map((topic) => (
            <span 
              key={topic} 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-50/80 text-violet-700 border border-violet-200/50"
            >
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mr-2"></div>
              {topic}
            </span>
          ))}
          
          {(issue.labels.length + repo.topics.length > 6) && (
            <span className="text-xs text-slate-500 px-2 py-1">
              +{issue.labels.length + repo.topics.length - 6} more
            </span>
          )}
        </div>

        {/* Action button */}
        <div className="flex justify-end">
          <button
            onClick={() => onOpenStarterKit?.(card)}
            className="group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-medium shadow-lg shadow-blue-200/40 hover:shadow-xl hover:shadow-blue-300/50 transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Get Starter Kit
            </span>
            
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </div>
  );
}