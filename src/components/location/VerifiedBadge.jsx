export default function VerifiedBadge({ verified }) {
  return (
    <span className={`badge ${verified ? "badge-verified" : "badge-unverified"}`}>
      {verified ? "✓ Ubicación verificada" : "⚠ No verificado"}
    </span>
  );
}