import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const guestNavItems = [
  { label: "홈", to: "/" },
  { label: "작품 목록", to: "/novels" },
  { label: "로그인", to: "/login" },
  { label: "회원가입", to: "/register" },
];

const memberNavItems = [
  { label: "홈", to: "/" },
  { label: "작품 목록", to: "/novels" },
  { label: "작품 작성", to: "/write/novel" },
];

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    Boolean(localStorage.getItem("token")),
  );

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
  }, [location.pathname]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const navItems = isLoggedIn ? memberNavItems : guestNavItems;

  return (
    <header className="top-nav">
      <NavLink className="brand" to="/">
        <span className="brand-mark">U</span>
        <span>UZAK</span>
      </NavLink>
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            className={({ isActive }) => (isActive ? "active" : undefined)}
            key={item.to}
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
        {isLoggedIn && (
          <button
            className="nav-action"
            type="button"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
