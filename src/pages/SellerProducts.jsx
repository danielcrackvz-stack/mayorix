import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProductsBySeller } from "../services/products";

export default function SellerProducts() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductsBySeller(currentUser.uid).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [currentUser.uid]);

  if (loading) return <p>Cargando tus productos...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
        <h2>Mis productos</h2>
        <Link to="/publicar" className="btn btn-primary">+ Publicar producto</Link>
      </div>

      {products.length === 0 ? (
        <p style={{ color: "#6b7370", marginTop: "1rem" }}>
          Todavía no publicaste ningún producto. Usa el botón de arriba para crear el primero.
        </p>
      ) : (
        <div className="catalog-grid">
          {products.map((product) => (
            <Link key={product.id} to={`/producto/${product.id}`} className="product-card">
              <img src={product.images[0]} alt={product.title} />
              <div className="info">
                <h4>{product.title}</h4>
                <p className="price">Bs {product.price}</p>
                <p className="sale-type">Stock: {product.stock}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}