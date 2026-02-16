import { useMemo } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useWorkDetails } from "../hooks/useWorkDetails";
import { useAuthor } from "../hooks/useAuthors";
import { useWikipedia } from "../hooks/useWikipedia";
import { CardSkeleton } from "../components/Skeletons";
import { useFavorites } from "../hooks/useFavorites";
import { useBookSearch } from "../hooks/useBookSearch";
import "../styles/pages/common.css";

function isValidWorkOlid(olid: string) {
  return /^OL\d+W$/i.test(olid);
}

function safeQuote(s: string) {
  return `"${s.replaceAll('"', '\\"')}"`;
}

export default function WorkPage() {
  const { olid } = useParams({ from: "/work/$olid" });
  const valid = useMemo(() => isValidWorkOlid(olid), [olid]);

  const { data: work, isLoading, isError, error } = useWorkDetails(olid, valid);

  const firstAuthorKey = work?.authors?.[0]?.author?.key;
  const { data: author } = useAuthor(firstAuthorKey);

  const { toggle, isFavorite } = useFavorites();

  const wikiQuery = work?.title ? work.title : "";
  const { data: wiki, isLoading: wikiLoading, isError: wikiIsError } = useWikipedia(
    wikiQuery,
    Boolean(work?.title)
  );

  const authorName = author?.name?.trim() ?? "";
  const relatedQuery = authorName ? `author:${safeQuote(authorName)}` : "";

  const { data: related, isLoading: relatedLoading, isError: relatedIsError } = useBookSearch(
    relatedQuery,
    1,
    6
  );

  if (!valid) {
    return (
      <div className="container page">
        <div className="card cardPad">
          <h1 className="h1">Fiche livre</h1>
          <p style={{ color: "#b00020", marginTop: 10 }}>
            Identifiant invalide : <code>{olid}</code>
          </p>
          <div style={{ height: 10 }} />
          <Link to="/" className="btn" style={{ display: "inline-block", textDecoration: "none" }}>
            ← Retour accueil
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container page">
        <div className="grid grid--2">
          <div className="card cardPad">
            <div className="skel" style={{ width: 160, height: 240, borderRadius: 14 }} />
            <div style={{ height: 12 }} />
            <div className="skel skelTitle" style={{ width: "70%" }} />
            <div style={{ height: 10 }} />
            <div className="skel skelLine" style={{ width: "55%" }} />
          </div>

          <CardSkeleton lines={6} />
        </div>

        <CardSkeleton lines={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container page">
        <div className="card cardPad" style={{ borderColor: "#f2c2c2", background: "#fff5f5" }}>
          <strong>Erreur fiche livre</strong>
          <div className="subtle" style={{ marginTop: 6 }}>
            {(error as Error)?.message ?? "Unknown error"}
          </div>
        </div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="container page">
        <div className="card cardPad">
          <p style={{ margin: 0 }}>Aucune donnée.</p>
        </div>
      </div>
    );
  }

  const coverId = work.covers?.[0];
  const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null;

  const description =
    typeof work.description === "string" ? work.description : work.description?.value;

  const fav = isFavorite(olid);

  return (
    <div className="container page">
      {/* Header */}
      <div className="row" style={{ marginBottom: 2 }}>
        <div>
          <h1 className="h1">{work.title ?? "Sans titre"}</h1>
          <div className="subtle" style={{ marginTop: 6 }}>
            Auteur : <b>{author?.name ?? "inconnu"}</b>
            {work.first_publish_date ? (
              <>
                {" "}
                • Première publication : <b>{work.first_publish_date}</b>
              </>
            ) : null}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="btn"
            onClick={() =>
              toggle({
                olid,
                title: work.title,
                author: author?.name,
                coverId: work.covers?.[0],
              })
            }
          >
            {fav ? "★ En favori" : "☆ Ajouter aux favoris"}
          </button>

          <Link to="/favorites" className="btn" style={{ textDecoration: "none" }}>
            Voir favoris →
          </Link>

          <Link to="/advanced" className="btn" style={{ textDecoration: "none" }}>
            ↩ Retour recherche
          </Link>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid--2">
        {/* Cover card */}
        <div className="card cardPad" style={{ display: "grid", gap: 12 }}>
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 16,
              overflow: "hidden",
              background: "white",
              height: 320,
              display: "grid",
              placeItems: "center",
            }}
          >
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={`Couverture: ${work.title ?? ""}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className="coverPlaceholder">No cover</div>
            )}
          </div>

          <div className="row" style={{ justifyContent: "flex-start" }}>
            <span className="badge">Open Library</span>
            <span className="badge">
              Key: <code>{work.key}</code>
            </span>
          </div>
        </div>

        {/* Details card */}
        <div className="card cardPad" style={{ display: "grid", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16 }}>Résumé</div>
            {description ? (
              <p style={{ marginTop: 8, lineHeight: 1.55 }}>{description}</p>
            ) : (
              <p className="subtle" style={{ marginTop: 8 }}>
                Pas de description Open Library.
              </p>
            )}
          </div>

          {work.subjects?.length ? (
            <div>
              <div style={{ fontWeight: 900, fontSize: 16 }}>Sujets</div>
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {work.subjects.slice(0, 16).map((s) => (
                  <span key={s} className="badge">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Wikipedia */}
      <div className="card cardPad">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Wikipedia</h2>
          {wiki ? <span className="badge">Enrichissement</span> : <span className="badge">Optionnel</span>}
        </div>

        <div style={{ height: 12 }} />

        {wikiLoading && <CardSkeleton lines={4} />}

        {!wikiLoading && wikiIsError && (
          <p style={{ color: "#b00020", margin: 0 }}>
            Impossible de récupérer Wikipedia pour le moment.
          </p>
        )}

        {!wikiLoading && !wikiIsError && !wiki && (
          <p className="subtle" style={{ margin: 0 }}>
            Aucune information Wikipedia trouvée.
          </p>
        )}

        {!wikiLoading && wiki && (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
            {wiki.thumbnail?.source ? (
              <img
                src={wiki.thumbnail.source}
                alt=""
                style={{
                  width: 140,
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  background: "white",
                }}
              />
            ) : null}

            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontWeight: 900 }}>{wiki.title}</div>

              {wiki.extract ? (
                <p style={{ marginTop: 8, lineHeight: 1.55 }}>
                  {wiki.extract.slice(0, 450)}
                  {wiki.extract.length > 450 ? "…" : ""}
                </p>
              ) : (
                <p className="subtle" style={{ marginTop: 8 }}>
                  Pas de résumé disponible.
                </p>
              )}

              {wiki.content_urls?.desktop?.page ? (
                <a
                  href={wiki.content_urls.desktop.page}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btnPrimary"
                  style={{ display: "inline-block", textDecoration: "none" }}
                >
                  Ouvrir sur Wikipedia →
                </a>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Related books */}
      <div className="card cardPad">
        <div className="row">
          <h2 style={{ margin: 0, fontSize: 18 }}>Autres livres du même auteur</h2>
          <span className="badge">{author?.name ?? "inconnu"}</span>
        </div>

        <div style={{ height: 12 }} />

        {!authorName ? (
          <p className="subtle" style={{ margin: 0 }}>
            Auteur inconnu : impossible de proposer des livres similaires.
          </p>
        ) : relatedLoading ? (
          <CardSkeleton lines={4} />
        ) : relatedIsError ? (
          <p style={{ color: "#b00020", margin: 0 }}>
            Impossible de charger les livres similaires.
          </p>
        ) : related?.docs?.length ? (
          <div className="grid grid--3" key={`related-${olid}`}>
            {related.docs
              .filter((d) => d.key?.startsWith("/works/"))
              .map((d) => {
                const w = d.key.replace("/works/", "");
                if (w.toUpperCase() === olid.toUpperCase()) return null;

                const cover = d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : null;

                return (
                  <div key={d.key} className="card cardPad" style={{ display: "grid", gap: 10 }}>
                    <div style={{ display: "flex", gap: 12 }}>
                      <div
                        style={{
                          width: 76,
                          height: 110,
                          borderRadius: 16,
                          border: "1px solid rgba(17,24,39,0.12)",
                          overflow: "hidden",
                          background: "white",
                          flexShrink: 0,
                        }}
                      >
                        {cover ? (
                          <img src={cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div className="coverPlaceholder">—</div>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 900, lineHeight: 1.2 }}>{d.title ?? "(sans titre)"}</div>
                        <div className="subtle" style={{ marginTop: 6 }}>
                          {d.first_publish_year ? `• ${d.first_publish_year}` : ""}
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/work/$olid"
                      params={{ olid: w }}
                      className="btn btnPrimary"
                      style={{ textDecoration: "none", textAlign: "center" }}
                    >
                      Ouvrir →
                    </Link>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="subtle" style={{ margin: 0 }}>
            Aucun résultat similaire.
          </p>
        )}
      </div>
    </div>
  );
}
