import { useMemo, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useBookSearch } from "../hooks/useBookSearch";
import Pagination from "../components/Pagination";
import { GridSkeleton } from "../components/Skeletons";
import "../styles/pages/common.css";

function buildOpenLibraryQuery(input: {
  title?: string;
  author?: string;
  subject?: string;
  year?: string;
  fallbackQ?: string;
}) {
  const parts: string[] = [];
  const safe = (s: string) => `"${s.replaceAll('"', '\\"')}"`;

  if (input.fallbackQ?.trim()) parts.push(input.fallbackQ.trim());
  if (input.title?.trim()) parts.push(`title:${safe(input.title.trim())}`);
  if (input.author?.trim()) parts.push(`author:${safe(input.author.trim())}`);
  if (input.subject?.trim()) parts.push(`subject:${safe(input.subject.trim())}`);
  if (input.year?.trim() && /^\d{4}$/.test(input.year.trim())) {
    parts.push(`first_publish_year:${input.year.trim()}`);
  }

  return parts.join(" ").trim();
}

export default function AdvancedSearchPage() {
  const navigate = useNavigate();

  const search = useSearch({ from: "/advanced" }) as {
    q?: string;
    title?: string;
    author?: string;
    subject?: string;
    year?: string;
    page?: number;
  };

  const [title, setTitle] = useState(search.title ?? "");
  const [author, setAuthor] = useState(search.author ?? "");
  const [subject, setSubject] = useState(search.subject ?? "");
  const [year, setYear] = useState(search.year ?? "");

  const page = Number(search.page ?? 1);
  const limit = 20;

  const qFinal = useMemo(() => {
    return buildOpenLibraryQuery({
      fallbackQ: search.q ?? "",
      title,
      author,
      subject,
      year,
    });
  }, [search.q, title, author, subject, year]);

  const { data, isLoading, isError, error } = useBookSearch(qFinal, page, limit);

  const total = data?.numFound ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/advanced",
      search: {
        q: search.q ?? "",
        title: title.trim() || undefined,
        author: author.trim() || undefined,
        subject: subject.trim() || undefined,
        year: year.trim() || undefined,
        page: 1,
      },
    });
  };

  const onReset = () => {
    setTitle("");
    setAuthor("");
    setSubject("");
    setYear("");
    navigate({ to: "/advanced", search: { q: search.q ?? "", page: 1 } });
  };

  return (
    <div className="container page">
      {/* Header + form */}
      <div className="page-header">
        <div className="page-header__content">
          <h1 className="page-title">Recherche avancée</h1>
          <p className="page-subtitle">
            Filtres précis — Titre, auteur, sujet et année de publication
          </p>

          <form onSubmit={onSubmit} className="grid" style={{ gap: 10, marginTop: 16 }}>
            <div className="grid grid--2" style={{ gap: 10 }}>
              <input placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
              <input placeholder="Auteur" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>

            <div className="grid grid--2" style={{ gap: 10 }}>
              <input placeholder="Sujet / tag" value={subject} onChange={(e) => setSubject(e.target.value)} />
              <input placeholder="Année (YYYY)" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>

            <div className="row" style={{ justifyContent: "flex-start", gap: 8 }}>
              <button type="submit" className="btn btnPrimary">
                Rechercher →
              </button>
              <button type="button" className="btn" onClick={onReset}>
                Reset
              </button>
              <Link to="/" className="btn" style={{ textDecoration: "none" }}>
                ← Accueil
              </Link>
            </div>
          </form>

          {qFinal && (
            <div style={{ marginTop: 12 }}>
              <div className="subtle">
                Requête : <code>{qFinal}</code>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty query */}
      {qFinal.length === 0 && (
        <div className="card cardPad">
          <p className="subtle" style={{ margin: 0 }}>
            Remplis au moins un champ pour lancer la recherche.
          </p>
        </div>
      )}

      {/* Loading */}
      {isLoading && qFinal.length > 0 && <GridSkeleton count={6} />}

      {/* Error */}
      {isError && (
        <div className="card cardPad" style={{ borderColor: "#f2c2c2", background: "#fff5f5" }}>
          <strong>Erreur recherche</strong>
          <div className="subtle" style={{ marginTop: 6 }}>
            {(error as Error)?.message ?? "Unknown error"}
          </div>
        </div>
      )}

      {/* Results */}
      {!isLoading && !isError && data && (
        <div className="grid" style={{ gap: 14 }} key={`results-${qFinal}-${page}`}>
          <div className="section-head">
            <h2>Résultats</h2>
            <span className="badge">{total} trouvés</span>
          </div>

          <div className="subtle">
            Page <b>{page}</b> / <b>{totalPages}</b>
          </div>

          {data.docs.length === 0 ? (
            <div className="card cardPad">
              <p style={{ margin: 0 }}>Aucun résultat.</p>
            </div>
          ) : (
            <div className="grid grid--3" key={`docs-grid-${qFinal}`}>
              {data.docs.map((d) => {
                const workKey = d.key?.startsWith("/works/") ? d.key.replace("/works/", "") : "";
                const coverUrl = d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : null;

                return (
                  <div key={d.key} className="card cardPad" style={{ display: "grid", gap: 10 }}>
                    <div style={{ display: "flex", gap: 12 }}>
                      <div
                        style={{
                          width: 76,
                          height: 110,
                          borderRadius: 16,
                          border: "1px solid var(--border)",
                          overflow: "hidden",
                          background: "white",
                          flexShrink: 0,
                        }}
                      >
                        {coverUrl ? (
                          <img src={coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div
                            className="subtle"
                            style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}
                          >
                            —
                          </div>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 900, lineHeight: 1.2 }}>
                          {d.title ?? "(sans titre)"}
                        </div>

                        <div className="subtle" style={{ marginTop: 6 }}>
                          {d.author_name?.[0] ?? "Auteur inconnu"}
                          {d.first_publish_year ? ` • ${d.first_publish_year}` : ""}
                        </div>
                      </div>
                    </div>

                    {workKey ? (
                      <Link
                        to="/work/$olid"
                        params={{ olid: workKey }}
                        className="btn btnPrimary"
                        style={{ textAlign: "center", textDecoration: "none" }}
                      >
                        Voir la fiche →
                      </Link>
                    ) : (
                      <span className="badge">Fiche non disponible</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPage={(p) =>
              navigate({
                to: "/advanced",
                search: { ...search, page: p },
              })
            }
          />
        </div>
      )}
    </div>
  );
}
