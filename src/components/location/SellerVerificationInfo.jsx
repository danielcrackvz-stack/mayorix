import VerifiedBadge from "./VerifiedBadge";
import SellerLocationMap from "./SellerLocationMap";

export default function SellerVerificationInfo({ seller }) {
  const verified = !!seller?.hasVerifiedLocation;

  return (
    <div style={{
      border: "1px solid var(--border)",
      background: "var(--surface)",
      borderRadius: "14px",
      padding: "1.25rem",
      marginTop: "1.5rem",
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <h4 style={{ margin: 0 }}>Ubicación del vendedor</h4>
        <VerifiedBadge verified={verified} />
      </div>

      {verified ? (
        <>
          <SellerLocationMap location={seller.location} sellerName={seller.name} />
          <div style={{ marginTop: "0.9rem" }}>
            <p style={{ fontSize: "0.85rem", color: "#6b7370", marginBottom: "0.4rem" }}>Foto del local del vendedor:</p>
            <img
              src={seller.storePhotoUrl}
              alt={`Tienda de ${seller.name}`}
              style={{ maxWidth: "100%", borderRadius: "10px", border: "1px solid var(--border)" }}
            />
          </div>
        </>
      ) : (
        <p style={{ fontSize: "0.85rem", color: "var(--amber)" }}>
          Este vendedor todavía no verificó la ubicación de su tienda o casa. Ten precaución antes de coordinar una compra.
        </p>
      )}
    </div>
  );
}