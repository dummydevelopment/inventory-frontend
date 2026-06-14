import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import "./AppLayout.css";
import { useState } from "react";
import Workflow from "./components/Workflow";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";

function App() {
  const [expanded, setExpanded] = useState({});

  const sidebarItems = [
    {
      label: "Home",
      route: "/",
    },

    {
      label: "Dashboard",
      children: [
        {
          label: "Main Dashboard",
          route: "/dashboard/main",
        },
        {
          label: "Master Dashboard",
          route: "/dashboard/master",
        },
      ],
    },
    {
      label: "Work flow",
      route: "/workflow",
    },
  ];

  const toggle = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderSidebarItems = (items, level = 0) => {
    return (
      <>
        {items.map((item, index) => {
          const hasChildren = item.children?.length > 0;

          const key = `${item.label}-${level}-${index}`;

          return (
            <div key={key}>
              {hasChildren ? (
                <button
                  className="sidebar-expand-btn"
                  onClick={() => toggle(key)}
                >
                  {expanded[key] ? "▼ " : "▶ "}
                  {item.label}
                </button>
              ) : (
                <NavLink
                  className="sidebar-link"
                  to={item.route}
                >
                  {item.label}
                </NavLink>
              )}

              {hasChildren && expanded[key] && (
                <div style={{ paddingLeft: 20 }}>
                  {renderSidebarItems(item.children, level + 1)}
                </div>
              )}
            </div>
          );
        })}
      </>
    );
  };


  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar-layout">
          <Navbar />
        </nav>

        <div className="container-aside-main">

          <aside className="sidebar">

            <div className="sidebar-content">
              {renderSidebarItems(sidebarItems)}
            </div>

            <div className="sidebar-settings">
              <NavLink to="/settings">
                Settings
              </NavLink>
            </div>

          </aside>

          <main>
            <Routes>
              <Route path="/" element={<h1>Home</h1>} />

              <Route
                path="/dashboard"
                element={<h1>Dashboard</h1>}
              />
              <Route
                path="/workflow"
                element={<Workflow />}
              />
              <Route
                path="/login"
                element={<Login />}
              />
              <Route
                path="/dashboard/main"
                element={<h1>Main Dashboard</h1>}
              />

              <Route
                path="/dashboard/master"
                element={<h1>Master Dashboard</h1>}
              />

              <Route
                path="/settings"
                element={<h1>Settings</h1>}
              />
            </Routes>
          </main>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;