import { Link } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.container}>
      <Link to="/">
        <svg
          width="80"
          height="40"
          viewBox="0 0 80 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ borderRadius: "6px", background: "#eee" }}
          aria-label="Logo"
        >
          <rect width="80" height="40" rx="6" fill="#4F8CFF" />
          <circle cx="20" cy="20" r="10" fill="#fff" />
          <circle cx="40" cy="20" r="10" fill="#FFD700" />
          <circle cx="60" cy="20" r="10" fill="#fff" />
          <text
            x="40"
            y="25"
            textAnchor="middle"
            fontSize="12"
            fill="#333"
            fontFamily="Arial"
            fontWeight="bold"
          ></text>
        </svg>
      </Link>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link to="/"> Home Page</Link>
          </li>
          <li>Profile</li>
          <li>dark mode</li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
