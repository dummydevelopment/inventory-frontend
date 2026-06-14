import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");

    navigate("/login");

    window.location.reload();
  };

  return (
    <nav className="navbar">

      <div className="navbar-left">
        <NavLink
          to="/"
          className="logo"
        >
          Inventory System
        </NavLink>
      </div>

      <div className="navbar-right">

        {loggedInUser ? (
          <>
            <div className="logged-user">

              <span>
                {loggedInUser.role}
              </span>

              <span>
                {loggedInUser.class}-{loggedInUser.section}
              </span>

              {loggedInUser.rollNumber && (
                <span>
                  Roll {loggedInUser.rollNumber}
                </span>
              )}

              <span className="email">
                {loggedInUser.email}
              </span>

            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}

      </div>

    </nav>
  );
}

export default Navbar;