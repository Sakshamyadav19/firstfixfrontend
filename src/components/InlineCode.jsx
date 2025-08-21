export function InlineCode({ children }) {
  return (
    <code className="relative inline-flex items-center bg-slate-100/80 text-slate-800 px-2 py-1 rounded-lg text-sm font-mono border border-slate-200/50">
      {children}
    </code>
  );
}