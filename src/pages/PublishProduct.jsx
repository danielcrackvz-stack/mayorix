import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createProduct } from "../services/products";
import { verifySellerLocation } from "../services/sellers";
import { uploadImage } from "../services/cloudinary";
import LocationPicker from "../components/location/LocationPicker";

export default function PublishProduct() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [saleType, setSaleType] = useState("ambos");
  const [files, setFiles] = useState([]);

  const [location, setLocation] = useState(null);
  const [storePhoto, setStorePhoto] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const needsVerification = !userProfile?.hasVerifiedLocation;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (files.length === 0) {
      setError("Sube al menos una fotografía del producto.");
      return;
    }
    if (needsVerification && (!location || !storePhoto)) {
      setError("Marca tu ubicación y sube una foto de tu tienda o casa para verificar tu cuenta.");
      return;
    }

    try {
      setUploading(true);
      const imageUrls = await Promise.all(Array.from(files).map((file) => uploadImage(file)));

      if (needsVerification) {
        const storePhotoUrl = await uploadImage(storePhoto);
        await verifySellerLocation(currentUser.uid, location, storePhotoUrl);
      }

      await createProduct({
        sellerId: currentUser.uid,
        sellerName: userProfile.name,
        title,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        saleType,
        images: imageUrls,
      });

      navigate("/mis-productos");
    } catch (err) {
      setError("Ocurrió un error al publicar el producto. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: "560px" }}>
      <h2>Publicar producto</h2>
      {error && <p style={{ color: "var(--amber)", fontSize: "0.9rem" }}>{error}</p>}

      <input className="field" placeholder="Nombre del producto" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea className="field" placeholder="Descripción" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input className="field" type="number" step="0.01" placeholder="Precio (Bs)" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <input className="field" type="number" placeholder="Stock disponible" value={stock} onChange={(e) => setStock(e.target.value)} required />

      <select className="field" value={saleType} onChange={(e) => setSaleType(e.target.value)}>
        <option value="ambos">Al por mayor y al por menor</option>
        <option value="mayor">Solo al por mayor</option>
        <option value="menor">Solo al por menor</option>
      </select>

      <label style={{ fontSize: "0.85rem", color: "var(--ink)" }}>Fotos del producto</label>
      <input className="field" type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} required />

      {needsVerification && (
        <div style={{
          border: "1px dashed var(--teal)",
          background: "var(--teal-light)",
          borderRadius: "10px",
          padding: "1.1rem",
          marginTop: "0.5rem",
          marginBottom: "1rem",
        }}>
          <h4 style={{ marginBottom: "0.3rem" }}>Verifica tu cuenta como vendedor</h4>
          <p style={{ fontSize: "0.85rem", color: "#4a5b57", marginBottom: "0.75rem" }}>
            Esto se pide solo una vez. Marca la ubicación de tu tienda o casa y sube una foto del frente
            para que los compradores confíen más en tu publicación.
          </p>

          <LocationPicker onLocationSelect={setLocation} />

          <div style={{ marginTop: "0.75rem" }}>
            <label style={{ fontSize: "0.85rem" }}>Foto del frente de tu tienda o casa:</label>
            <input className="field" type="file" accept="image/*" onChange={(e) => setStorePhoto(e.target.files[0])} />
          </div>
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={uploading} style={{ width: "100%" }}>
        {uploading ? "Publicando..." : "Publicar producto"}
      </button>
    </form>
  );
}