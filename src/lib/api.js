const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001";

export async function searchIssues(skills) {
  const params = new URLSearchParams({ skills });
  const res = await fetch(`${API_BASE}/api/search?${params.toString()}`);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  const data = await res.json();
  return data.items || [];
}

export async function getStarterKit(owner, repo, number) {
  const params = new URLSearchParams({ owner, repo, number: String(number) });
  const res = await fetch(`${API_BASE}/api/starter_kit?${params.toString()}`);
  if (!res.ok) throw new Error(`Starter kit failed: ${res.status}`);
  return res.json();
}
