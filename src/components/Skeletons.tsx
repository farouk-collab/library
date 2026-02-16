export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="card cardPad">
      <div className="skel skelTitle" style={{ width: "70%" }} />
      <div style={{ height: 10 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ marginTop: i === 0 ? 0 : 8 }}>
          <div className="skel skelLine" style={{ width: `${90 - i * 10}%` }} />
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid--3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} lines={3} />
      ))}
    </div>
  );
}
