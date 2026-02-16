import { useQuery } from "@tanstack/react-query";
import { fetchWikipediaSummary, searchWikipediaTitle } from "../api/wikipedia";

export function useWikipedia(query: string, enabled: boolean) {
  return useQuery({
    queryKey: ["wikipedia", query],
    enabled: enabled && query.trim().length > 0,
    queryFn: async () => {
      const title = await searchWikipediaTitle(query);
      if (!title) return null;
      return fetchWikipediaSummary(title);
    },
    retry: 1,
  });
}
