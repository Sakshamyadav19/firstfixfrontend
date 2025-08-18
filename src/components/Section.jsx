import React from "react";

export default function Section({ title, children, right }) {
  return (
    <section className="bg-white rounded-2xl border p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">{title}</h2>
        {right}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}
