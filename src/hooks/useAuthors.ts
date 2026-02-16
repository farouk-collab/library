import { useQuery } from "@tanstack/react-query";
import { fetchAuthorByKey } from "../api/openlibrary";

export function useAuthor(authorKey: string | undefined) {
  return useQuery({
    queryKey: ["author", authorKey],
    queryFn: () => fetchAuthorByKey(authorKey!),
    enabled: Boolean(authorKey),
  });
}
