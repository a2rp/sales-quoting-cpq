import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiPlus, FiX } from "react-icons/fi";
import styles from "./styles.module.css";
const Header = ({ onNewQuote }) => {
 const [menuOpen,setMenuOpen]=useState(false); const [hidden,setHidden]=useState(false);
 useEffect(()=>{let previous=window.scrollY;const onScroll=()=>{const current=window.scrollY;if(current<50||current<previous-2)setHidden(false);else if(current>previous+2&&!menuOpen)setHidden(true);previous=current};window.addEventListener("scroll",onScroll,{passive:true});return()=>window.removeEventListener("scroll",onScroll)},[menuOpen]);
 const close=()=>setMenuOpen(false); const linkClass=({isActive})=>[styles.navLink,isActive?styles.active:""].join(" ");
 return <header className={[styles.header,hidden&&!menuOpen?styles.hidden:""].join(" ")}><div className={styles.bar}><NavLink className={styles.brand} to="/quotes" onClick={close} aria-label="Lineform quotes"><span className={styles.mark}>L</span><span>lineform<span className={styles.period}>.</span></span></NavLink><div className={[styles.navWrap,menuOpen?styles.open:""].join(" ")}><nav className={styles.nav} aria-label="Main navigation"><NavLink className={linkClass} to="/quotes" onClick={close}>Quotes</NavLink><NavLink className={linkClass} to="/catalog" onClick={close}>Catalog</NavLink><NavLink className={linkClass} to="/approvals" onClick={close}>Approvals</NavLink></nav><button className={styles.newQuote} type="button" onClick={()=>{close();onNewQuote()}}><FiPlus/> New quote</button></div><span className={styles.workspace}>NORTH AMERICA <i/></span><button className={styles.menu} type="button" aria-label={menuOpen?"Close navigation":"Open navigation"} aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<FiX/>:<FiMenu/>}</button></div></header>;
};
export default Header;
