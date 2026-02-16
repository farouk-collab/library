const OPENLIB_BASE = "https://openlibrary.org";

export type RecentChange = {
  id?: string;
  kind?: string;
  timestamp?: string;
  comment?: string;
  author?: { key?: string };
  changes?: Array<{ key?: string; revision?: number }>;
};

export async function fetchRecentChanges(limit = 10): Promise<RecentChange[]> {
  const url = `${OPENLIB_BASE}/recentchanges.json?limit=${encodeURIComponent(String(limit))}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`OpenLibrary recentchanges failed: ${res.status}`);
  }

  return res.json();
}
export type SearchDoc = {
  key: string; // ex: "/works/OL27448W"
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
};

export type SearchResponse = {
  numFound?: number;
  start?: number;
  docs: SearchDoc[];
};

export async function searchBooks(params: {
  q: string;
  page?: number;
  limit?: number;
}): Promise<SearchResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  const url =
    `${OPENLIB_BASE}/search.json` +
    `?q=${encodeURIComponent(params.q)}` +
    `&page=${encodeURIComponent(String(page))}` +
    `&limit=${encodeURIComponent(String(limit))}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`OpenLibrary search failed (${res.status})`);
  return res.json();
}
export type WorkDetails = {
  key: string; // "/works/OL....W"
  title?: string;
  description?: string | { value?: string };
  subjects?: string[];
  covers?: number[];
  first_publish_date?: string;
  authors?: Array<{ author?: { key?: string } }>;
};

export type AuthorDetails = {
  key: string; // "/authors/OL....A"
  name?: string;
};

export async function fetchWorkById(olid: string): Promise<WorkDetails> {
  // olid attendu: "OLxxxxW"
  const url = `${OPENLIB_BASE}/works/${encodeURIComponent(olid)}.json`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`OpenLibrary work failed (${res.status})`);
  return res.json();
}

export async function fetchAuthorByKey(authorKey: string): Promise<AuthorDetails> {
  // authorKey attendu: "/authors/OL...A"
  const url = `${OPENLIB_BASE}${authorKey}.json`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`OpenLibrary author failed (${res.status})`);
  return res.json();
}
