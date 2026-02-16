import { Link } from "@tanstack/react-router";
import { useRecentChanges } from "../hooks/useRecentChanges";
import { GridSkeleton } from "../components/Skeletons";
import "../styles/pages/home.css";
import "../styles/pages/common.css";

function extractWorkOlid(key?: string) {
  if (!key?.startsWith("/works/")) return null;
  const id = key.replace("/works/", "");
  return /^OL\d+W$/i.test(id) ? id : null;
}

const CATEGORIES = [
  "Fantasy",
  "Science",
  "History",
  "Romance",
  "Mystery",
  "Horror",
  "Poetry",
  "Biography",
  "Philosophy",
  "Programming",
] as const;

export default function HomePage() {
  const { data, isLoading, isError, error, refetch } = useRecentChanges(12);

  return (
    <div className="home">
      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero__grid">
          <div className="home-hero__content">
            <h1 className="home-title">Bibliothèque — Explorer</h1>
            <p className="home-subtitle">
              Recherche rapide en haut, recherche avancée pour filtrer précisément,
              et fiches enrichies avec Wikipedia.
            </p>

            <div className="home-actions">
              <Link to="/advanced" className="home-btn home-btn--primary">
                Recherche avancée →
              </Link>
              <button className="home-btn" onClick={() => refetch()}>
                Rafraîchir le live feed
              </button>
            </div>
          </div>

          <aside className="home-hero__side">
            <div className="home-miniCard">
              <div className="home-miniCard__title">Astuce</div>
              <div className="home-miniCard__text">
                Clique une carte <code>/works/OL…W</code> pour ouvrir la fiche.
              </div>
            </div>

            <div className="home-miniCard">
              <div className="home-miniCard__title">Navigation</div>
              <div className="home-miniCard__text">
                Clique une catégorie pour afficher des résultats immédiatement.
              </div>
            </div>
          </aside>
        </div>

        {/* CATEGORIES */}
        <div className="home-sectionHead">
          <h2 className="home-h2">Catégories</h2>
          <span className="home-badge">1 clic → résultats</span>
        </div>

        <div className="home-chips">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to="/advanced"
              search={{ subject: c, page: 1 }}
              className="home-chip"
            >
              <span className="home-chip__dot" />
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Recent changes */}
      <div className="home-sectionHead">
        <div>
          <h2 className="home-h2">Changements récents</h2>
          <div className="home-muted">Flux Open Library RecentChanges.</div>
        </div>
        <span className="home-badge">{data?.length ?? 0} items</span>
      </div>

      {isLoading && <GridSkeleton count={6} />}

      {isError && (
        <div className="home-alert">
          <div className="home-alert__title">Impossible de charger les changements récents.</div>
          <div className="home-muted">
            {(error as Error)?.message ?? "Unknown error"}
          </div>

          <div className="home-actions">
            <button className="home-btn" onClick={() => refetch()}>
              Réessayer
            </button>
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="home-cards">
          {data?.map((c, idx) => {
            const date = c.timestamp ? new Date(c.timestamp).toLocaleString() : "—";
            const objectKey = c.changes?.[0]?.key;
            const workOlid = extractWorkOlid(objectKey);

            const stableKey =
              objectKey ||
              c.author?.key ||
              c.id ||
              `${c.kind ?? "change"}-${c.timestamp ?? "t"}-${idx}`;

            return (
              <article key={stableKey} className="home-card">
                <div className="home-card__top">
                  <span className="home-badge">{c.kind ?? "change"}</span>
                  <span className="home-muted">{date}</span>
                </div>

                <div className="home-card__title">
                  {c.comment ?? "Aucun commentaire"}
                </div>

                {objectKey ? (
                  <div className="home-muted">
                    Objet: <code>{objectKey}</code>
                  </div>
                ) : null}

                <div className="home-card__bottom">
                  {workOlid ? (
                    <Link
                      to="/work/$olid"
                      params={{ olid: workOlid }}
                      className="home-btn home-btn--primary home-btn--full"
                    >
                      Ouvrir la fiche →
                    </Link>
                  ) : (
                    <span className="home-badge">Pas de fiche Work</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
