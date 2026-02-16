type WikiSearchResponse = {
  query?: {
    search?: Array<{
      title: string;
      pageid: number;
    }>;
  };
};

export type WikiSummary = {
  title: string;
  extract: string;
  content_urls?: { desktop?: { page?: string } };
  thumbnail?: { source?: string; width?: number; height?: number };
};

export async function searchWikipediaTitle(query: string): Promise<string | null> {
  const url =
    `https://en.wikipedia.org/w/api.php` +
    `?action=query&list=search&format=json&origin=*` +
    `&srlimit=1&srsearch=${encodeURIComponent(query)}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Wikipedia search failed (${res.status})`);

  const data = (await res.json()) as WikiSearchResponse;
  const first = data.query?.search?.[0]?.title;
  return first ?? null;
}

export async function fetchWikipediaSummary(title: string): Promise<WikiSummary> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Wikipedia summary failed (${res.status})`);

  return res.json();
}
