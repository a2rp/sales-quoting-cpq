import { FaGithub } from "react-icons/fa";
import { FiArrowUpRight, FiGlobe } from "react-icons/fi";
import styles from "./styles.module.css";
const Footer=()=> <footer className={styles.footer}><div className={styles.top}><div><span className={styles.wordmark}><b>L</b> lineform<span>.</span></span><p>Clear proposals. Considered pricing.</p></div><div className={styles.links}><a href="https://github.com/a2rp" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><FaGithub/></a><a href="https://www.ashishranjan.net" target="_blank" rel="noreferrer" aria-label="Portfolio website" title="Portfolio"><FiGlobe/></a></div></div><div className={styles.bottom}><span>Frontend demo · Quote data resets when refreshed</span><a href="https://www.ashishranjan.net" target="_blank" rel="noreferrer"><img src={`${import.meta.env.BASE_URL}logo.png`} alt=""/> Made by Ashish Ranjan <FiArrowUpRight/></a></div></footer>;
export default Footer;
