import { useDashboard } from "../hooks/useDashboard"
const money=(value)=>{
new Intl.NumberFormat("en-In",{
    style:"currency",
    currency: "INR",
    maximumFractionDigits: 2,
}).format(value || 0)
}
export default function DashboardPage() {
  const { data, isPending, isError, error } = useDashboard();
   if (isPending) return <p>Loading dashboard...</p>;
     if (isError) {
    return <p>Could not load dashboard: {error.message}</p>;
  }

  const cards = [
    ["Total invoices", data.totalInvoices],
    ["Sales revenue", money(data.totalSalesRevenue)],
    ["Amount paid", money(data.amountPaid)],
    ["Outstanding", money(data.outstandingBalance)],
    ["Draft invoices", data.draftInvoices],
    ["Paid invoices", data.paidInvoices],
    ["Unpaid invoices", data.unpaidInvoices],
    ["Partially paid", data.partialInvoices],
  ];
   return (
    <div>
      <h1>Dashboard</h1>
      <p>Overview of your invoice business.</p>

      <div className="summary-grid">
        {cards.map(([label, value]) => (
          <article className="summary-card" key={label}>
            <p>{label}</p>
            <h2>{value}</h2>
          </article>
        ))}
      </div>
      <section className="dashboard-section">
        <h2>Recent invoices</h2>

        {data.recentInvoices?.length ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Invoice number</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {data.recentInvoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>
                      {invoice.customer?.name || "Unknown customer"}
                    </td>
                    <td>{money(invoice.grandTotal)}</td>
                    <td>{invoice.status}</td>
                    <td>{invoice.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No invoices yet.</p>
        )}
      </section>
    </div>
   )
}