import { useQuery } from "@tanstack/react-query";
import { fetchRecentChanges } from "../api/openlibrary";

export function useRecentChanges(limit = 10) {
  return useQuery({
    queryKey: ["recentChanges", limit],
    queryFn: () => fetchRecentChanges(limit),
  });
}
