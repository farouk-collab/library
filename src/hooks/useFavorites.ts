import { useCallback, useMemo, useState } from "react";

const KEY = "library:favorites";

export type FavoriteItem = {
  olid: string; // OLxxxxW
  title?: string;
  author?: string;
  coverId?: number;
};

function read(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: FavoriteItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function useFavorites() {
  const [items, setItems] = useState<FavoriteItem[]>(() => read());

  const isFavorite = useCallback(
    (olid: string) => items.some((x) => x.olid.toUpperCase() === olid.toUpperCase()),
    [items]
  );

  const add = useCallback((item: FavoriteItem) => {
    setItems((prev) => {
      const next = prev.some((x) => x.olid.toUpperCase() === item.olid.toUpperCase())
        ? prev
        : [item, ...prev];
      write(next);
      return next;
    });
  }, []);

  const remove = useCallback((olid: string) => {
    setItems((prev) => {
      const next = prev.filter((x) => x.olid.toUpperCase() !== olid.toUpperCase());
      write(next);
      return next;
    });
  }, []);

  const toggle = useCallback((item: FavoriteItem) => {
    setItems((prev) => {
      const exists = prev.some((x) => x.olid.toUpperCase() === item.olid.toUpperCase());
      const next = exists
        ? prev.filter((x) => x.olid.toUpperCase() !== item.olid.toUpperCase())
        : [item, ...prev];
      write(next);
      return next;
    });
  }, []);

  return useMemo(() => ({ items, isFavorite, add, remove, toggle }), [items, isFavorite, add, remove, toggle]);
}
