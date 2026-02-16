import { useQuery } from "@tanstack/react-query";
import { fetchWorkById } from "../api/openlibrary";

export function useWorkDetails(olid: string, enabled: boolean) {
  return useQuery({
    queryKey: ["work", olid],
    queryFn: () => fetchWorkById(olid),
    enabled,
  });
}
