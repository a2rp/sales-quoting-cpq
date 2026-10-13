import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiPlus, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const Header = ({ onNewQuote }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let previousScroll = window.scrollY;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll < 50 || currentScroll < previousScroll - 2) setHidden(false);
      else if (currentScroll > previousScroll + 2 && !menuOpen) setHidden(true);
      previousScroll = currentScroll;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const navClass = ({ isActive }) => [styles.navLink, isActive ? styles.active : ""].join(" ");

  return (
    <header className={[styles.header, hidden && !menuOpen ? styles.hidden : ""].join(" ")}>
      <div className={styles.bar}>
        <NavLink className={styles.brand} to="/quotes" onClick={closeMenu} aria-label="Lineform quotes">
          <span className={styles.mark}>L</span><span>lineform<span className={styles.period}>.</span></span>
        </NavLink>
        <div className={[styles.navWrap, menuOpen ? styles.open : ""].join(" ")}>
          <nav className={styles.nav} aria-label="Main navigation">
            <NavLink className={navClass} to="/quotes" onClick={closeMenu}>Quotes</NavLink>
            <NavLink className={navClass} to="/catalog" onClick={closeMenu}>Catalog</NavLink>
            <NavLink className={navClass} to="/approvals" onClick={closeMenu}>Approvals</NavLink>
          </nav>
          <button className={styles.newQuote} type="button" onClick={() => { closeMenu(); onNewQuote(); }}><FiPlus aria-hidden="true" /> New quote</button>
        </div>
        <span className={styles.workspace}>NORTH AMERICA <i /></span>
        <button className={styles.menu} type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
