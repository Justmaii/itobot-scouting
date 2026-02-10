import logo from "../assets/itobot-logo.jpg";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  isLoggedIn: boolean;
  username: string;
  onLogout: () => void;
}

export const Navbar = ({
  theme,
  toggleTheme,
  isLoggedIn,
  username,
  onLogout,
}: NavbarProps) => {
  return (
    <nav className="navbar-background mb-4 transition-all">
      <div className="container d-flex justify-content-between align-items-center">
        <a
          className="logo-text d-flex align-items-center"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (isLoggedIn) window.location.reload();
          }}
        >
          <img className="logo me-2" src={logo} alt="6038" />
          6038 Scouting
        </a>

        <div className="d-flex align-items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center ${theme === "light" ? "btn-outline-light" : "btn-outline-warning"}`}
            style={{ width: "32px", height: "32px" }}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <i className="bi bi-moon-fill fs-6"></i>
            ) : (
              <i className="bi bi-sun-fill fs-6"></i>
            )}
          </button>

          {isLoggedIn ? (
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-light text-dark shadow-sm d-none d-sm-inline">
                <i className="bi bi-person-fill me-1"></i>
                {username}
              </span>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={onLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Çıkış
              </button>
            </div>
          ) : (
            <button className="btn btn-sm btn-light text-primary fw-bold px-3 shadow-sm">
              Giriş Yap
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
