import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../services/products";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div>
      <h2 style={{ marginTop: "2rem" }}>Catálogo Mayorix</h2>
      <p style={{ color: "#6b6252" }}>Compra y venta al por mayor y al por menor, con vendedores verificados.</p>

      <div className="catalog-grid">
        {products.map((product) => (
          <Link key={product.id} to={`/producto/${product.id}`} className="product-card">
            <img src={product.images[0]} alt={product.title} />
            <div className="info">
              <h4>{product.title}</h4>
              <p className="price">Bs {product.price}</p>
              <p className="sale-type">
                {product.saleType === "ambos" ? "Mayor y menor" : `Al por ${product.saleType}`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}