import { Link } from "react-router-dom";
import { FiArrowLeft, FiFileText } from "react-icons/fi";
import styles from "./styles.module.css";
const NotFoundPage = () => <main className={styles.page}><span><FiFileText /></span><p className={styles.eyebrow}>404 · PAGE NOT FOUND</p><h1>This quote slipped the file.</h1><p>The page may have moved or the link may be incomplete. Head back to the quote workspace to continue.</p><Link to="/quotes"><FiArrowLeft /> Back to quotes</Link></main>;
export default NotFoundPage;
