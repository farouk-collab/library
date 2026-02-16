export default function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const clamp = (p: number) => Math.max(1, Math.min(totalPages, p));

  // Pages visibles : 1 ... (page-2 page-1 page page+1 page+2) ... total
  const windowPages = new Set<number>();
  windowPages.add(1);
  windowPages.add(totalPages);

  for (let p = page - 2; p <= page + 2; p++) {
    if (p >= 1 && p <= totalPages) windowPages.add(p);
  }

  const list = Array.from(windowPages).sort((a, b) => a - b);

  const items: Array<{ type: "page" | "dots"; value?: number }> = [];
  for (let i = 0; i < list.length; i++) {
    const current = list[i];
    const prev = list[i - 1];
    if (i > 0 && prev !== undefined && current - prev > 1) {
      items.push({ type: "dots" });
    }
    items.push({ type: "page", value: current });
  }

  return (
    <div className="row" style={{ justifyContent: "flex-start" }}>
      <button className="btn" disabled={page <= 1} onClick={() => onPage(clamp(page - 1))}>
        ← Précédent
      </button>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {items.map((it, idx) =>
          it.type === "dots" ? (
            <span key={`dots-${idx}`} className="badge">…</span>
          ) : (
            <button
              key={`page-${it.value}`}
              className={`btn ${it.value === page ? "btnPrimary" : ""}`}
              onClick={() => onPage(it.value!)}
            >
              {it.value}
            </button>
          )
        )}
      </div>

      <button className="btn" disabled={page >= totalPages} onClick={() => onPage(clamp(page + 1))}>
        Suivant →
      </button>
    </div>
  );
}
