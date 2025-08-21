import React from "react";

export default function Section({ title, children, right, icon, badge }) {
  return (
    <section className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-white/60 rounded-3xl shadow-lg shadow-slate-100/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-500">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-slate-800">{title}</h2>
              {badge && (
                <span className="inline-block mt-1 px-2 py-1 bg-blue-100/70 text-blue-700 text-xs font-medium rounded-lg">
                  {badge}
                </span>
              )}
            </div>
          </div>
          {right && <div className="flex-shrink-0">{right}</div>}
        </div>
        <div className="relative">
          {children}
        </div>
      </div>
    </section>
  );
}