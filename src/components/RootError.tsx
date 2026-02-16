export default function RootError({ error }: { error: unknown }) {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="card cardPad" style={{ borderColor: "#f2c2c2", background: "#fff5f5" }}>
        <strong>Une erreur est survenue.</strong>
        <div className="subtle" style={{ marginTop: 6 }}>
          {(error as Error)?.message ?? "Unknown error"}
        </div>
      </div>

      <a href="/" className="btn btnPrimary" style={{ textDecoration: "none", width: "fit-content" }}>
        Retour accueil →
      </a>
    </div>
  );
}
