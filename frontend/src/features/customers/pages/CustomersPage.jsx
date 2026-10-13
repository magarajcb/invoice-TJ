import { useState } from "react";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "../hooks/useCustomers";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

export default function CustomersPage() {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const customersQuery = useCustomers();
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const customers = customersQuery.data ?? [];

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...form });
      } else {
        await createMutation.mutateAsync(form);
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      alert(error.response?.data?.message || "Could not save customer");
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer._id);
    setForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      alert(error.response?.data?.message || "Could not delete customer");
    }
  };

  if (customersQuery.isPending) return <p>Loading customers...</p>;

  if (customersQuery.isError) {
    return <p>Failed to load customers: {customersQuery.error.message}</p>;
  }

  return (
    <div>
      <h1>Customers</h1>
      <p>Manage your customer records.</p>

      <form className="customer-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Customer name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {editingId ? "Update Customer" : "Add Customer"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.email || "—"}</td>
                <td>{customer.phone || "—"}</td>
                <td>{customer.address || "—"}</td>
                <td>
                  <button onClick={() => handleEdit(customer)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(customer._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="5">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}