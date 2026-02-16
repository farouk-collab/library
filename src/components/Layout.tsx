import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import "../styles/components/layout.css";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const onQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const val = q.trim();
    if (!val) return;

    setOpen(false);
    navigate({
      to: "/advanced",
      search: { q: val, page: 1 },
    });
  };

  return (
    <>
      <header className="nav">
        <div className="nav__inner">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <div className="brand__mark" />
            <div className="brand__text">
              <div className="brand__title">Bibliothèque</div>
              <div className="brand__subtitle">Open Library Explorer</div>
            </div>
          </Link>

          <div className="nav__spacer" />

          {/* Quick search desktop */}
          <form className="nav__search" onSubmit={onQuickSearch}>
            <input
              placeholder="Recherche rapide… (titre, auteur)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="btn btnPrimary" type="submit">
              Rechercher
            </button>
          </form>

          {/* Links desktop */}
          <nav className="nav__links">
            <Link
              to="/"
              className={`nav__link ${isActive(pathname, "/") ? "nav__link--active" : ""}`}
              onClick={() => setOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/advanced"
              className={`nav__link ${isActive(pathname, "/advanced") ? "nav__link--active" : ""}`}
              onClick={() => setOpen(false)}
            >
              Recherche avancée
            </Link>
          </nav>

          {/* Burger */}
          <button
            className="btn nav__burger"
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile panel */}
        {open ? (
          <div className="nav__panel">
            <form className="nav__search" onSubmit={onQuickSearch}>
              <input
                placeholder="Recherche rapide…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button className="btn btnPrimary" type="submit">
                Rechercher
              </button>
            </form>

            <nav className="nav__links">
              <Link
                to="/"
                className={`nav__link ${isActive(pathname, "/") ? "nav__link--active" : ""}`}
                onClick={() => setOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/advanced"
                className={`nav__link ${isActive(pathname, "/advanced") ? "nav__link--active" : ""}`}
                onClick={() => setOpen(false)}
              >
                Recherche avancée
              </Link>
            </nav>
          </div>
        ) : null}
      </header>

      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
