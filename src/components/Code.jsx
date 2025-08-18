import React from "react";

export function InlineCode({ children }) {
  return <code className="bg-gray-100 rounded px-1 py-0.5">{children}</code>;
}

export function BlockCode({ children }) {
  return (
    <pre className="mt-2 bg-gray-50 rounded-xl p-3 text-sm overflow-auto">
      {children}
    </pre>
  );
}
