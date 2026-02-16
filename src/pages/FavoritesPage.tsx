import { Link } from "@tanstack/react-router";
import { useFavorites } from "../hooks/useFavorites";
import "../styles/pages/common.css";

export default function FavoritesPage() {
  const { items, remove } = useFavorites();

  return (
    <div className="container page">
      <div className="row">
        <div>
          <h1 className="h1">Favoris</h1>
          <div className="subtle">Tes livres enregistrés (localStorage).</div>
        </div>
        <Link to="/advanced" className="btn" style={{ textDecoration: "none" }}>
          Aller chercher des livres →
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="card cardPad">
          <p style={{ margin: 0 }}>
            Aucun favori pour l’instant. Va sur une fiche livre et clique ⭐.
          </p>
        </div>
      ) : (
        <div className="grid grid--3">
          {items.map((f) => {
            const coverUrl = f.coverId ? `https://covers.openlibrary.org/b/id/${f.coverId}-M.jpg` : null;
            return (
              <div key={f.olid} className="card cardPad" style={{ display: "grid", gap: 10 }}>
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
                    {coverUrl ? (
                      <img src={coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div className="coverPlaceholder">—</div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 900, lineHeight: 1.2 }}>{f.title ?? f.olid}</div>
                    <div className="subtle" style={{ marginTop: 6 }}>{f.author ?? "Auteur inconnu"}</div>
                  </div>
                </div>

                <Link
                  to="/work/$olid"
                  params={{ olid: f.olid }}
                  className="btn btnPrimary"
                  style={{ textDecoration: "none", textAlign: "center" }}
                >
                  Ouvrir la fiche →
                </Link>

                <button className="btn" onClick={() => remove(f.olid)}>
                  Retirer des favoris
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
