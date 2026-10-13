import { useState } from "react";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../hooks/useProducts";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  sku: "",
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export default function ProductsPage() {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const productsQuery = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const products = productsQuery.data ?? [];

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const productData = {
      ...form,
      price: Number(form.price),
    };

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...productData });
      } else {
        await createMutation.mutateAsync(productData);
      }

      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || "Could not save product");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      sku: product.sku || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      alert(error.response?.data?.message || "Could not delete product");
    }
  };

  if (productsQuery.isPending) return <p>Loading products...</p>;

  if (productsQuery.isError) {
    return <p>Failed to load products: {productsQuery.error.message}</p>;
  }

  return (
    <div>
      <h1>Products</h1>
      <p>Manage products and their prices.</p>

      <form className="customer-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.sku || "—"}</td>
                <td>{product.description || "—"}</td>
                <td>{money(product.price)}</td>
                <td>
                  <button onClick={() => handleEdit(product)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(product._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}