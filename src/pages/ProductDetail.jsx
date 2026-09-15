import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProductById } from "../services/products";
import { getSellerProfile } from "../services/sellers";
import { getOrCreateChat } from "../services/chat";
import SellerVerificationInfo from "../components/location/SellerVerificationInfo";

export default function ProductDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    getProductById(id).then(async (data) => {
      setProduct(data);
      if (data?.sellerId) {
        const sellerData = await getSellerProfile(data.sellerId);
        setSeller(sellerData);
      }
    });
  }, [id]);

  async function handleContact() {
    const chatId = await getOrCreateChat(currentUser.uid, product.sellerId, product.id, product.title);
    navigate(`/mensajes/${chatId}`);
  }

  if (!product) return <p>Cargando...</p>;

  return (
    <div style={{ maxWidth: "640px", margin: "2rem auto" }}>
      <img src={product.images[0]} alt={product.title} style={{ width: "100%", borderRadius: "14px", border: "1px solid var(--border)" }} />

      <h2 style={{ marginTop: "1.25rem" }}>{product.title}</h2>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--teal-dark)", fontWeight: 600 }}>
        Bs {product.price}
      </p>
      <p>{product.description}</p>

      <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.9rem", color: "#4a5b57", margin: "0.75rem 0" }}>
        <span><strong>Stock:</strong> {product.stock}</span>
        <span><strong>Modalidad:</strong> {product.saleType === "ambos" ? "Mayor y menor" : `Al por ${product.saleType}`}</span>
      </div>
      <p style={{ fontSize: "0.9rem" }}><strong>Vendedor:</strong> {product.sellerName}</p>

      <SellerVerificationInfo seller={seller} />

      {currentUser.uid !== product.sellerId && (
        <button onClick={handleContact} className="btn btn-primary" style={{ marginTop: "1.25rem" }}>
          💬 Contactar vendedor
        </button>
      )}
    </div>
  );
}