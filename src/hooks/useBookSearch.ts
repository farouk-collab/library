import { useQuery } from "@tanstack/react-query";
import { searchBooks } from "../api/openlibrary";

export function useBookSearch(q: string, page: number, limit: number) {
  return useQuery({
    queryKey: ["bookSearch", q, page, limit],
    queryFn: () => searchBooks({ q, page, limit }),
    enabled: q.trim().length > 0, // évite de fetch quand vide
  });
}
