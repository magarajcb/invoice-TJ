import { NavLink, Outlet } from "react-router-dom";
const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Customers", to: "/customers" },
  { label: "Products", to: "/products" },
  { label: "Invoices", to: "/invoices" },
];

export default function App() {
  return(
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Invoice Bill generator</h2>
        <nav>
          {navItems.map((item)=>(
            <NavLink
             key={item.to}//generated link a unique React key
              to={item.to}
              end={item.to === "/"}
                className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }>
              {item.label}
            </NavLink>

          ))}
        </nav>
      </aside>
        <main className="main-content">
        <header className="topbar">
          <h2>Invoice Bill Generator</h2>
          <span>Local Workspace</span>
        </header>
         <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  )
}