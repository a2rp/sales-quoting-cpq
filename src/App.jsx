import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { catalogSeed, quoteSeed } from "./data/quotes";
import Header from "./components/header";
import Footer from "./components/footer";
import Modal from "./components/modal";
import Toast from "./components/toast";
import ConfirmationDialog from "./components/confirmationDialog";
import AppRoutes from "./AppRoutes";
import styles from "./app.module.css";

const App = () => {
  const [quotes, setQuotes] = useState(quoteSeed);
  const [catalog, setCatalog] = useState(catalogSeed);
  const [toast, setToast] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteQuote, setDeleteQuote] = useState(null);
  const [formError, setFormError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [location.pathname]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = useCallback((message, type = "success") => setToast({ message, type }), []);
  const addQuote = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const company = String(form.get("company") || "").trim();
    const contact = String(form.get("contact") || "").trim();
    const email = String(form.get("email") || "").trim();
    const title = String(form.get("title") || "").trim();
    if (!company || !contact || !email || !title) { setFormError("Complete each field to create a quote."); return; }
    const nextNumber = Math.max(1042, ...quotes.map((quote) => Number(quote.number.replace("LF-", "")))) + 1;
    const id = `quote-${nextNumber}`;
    const newQuote = { id, number: `LF-${nextNumber}`, company, contact, email, title, status: "Draft", created: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }), validUntil: "Nov 30, 2026", discount: 0, notes: "", terms: "Annual billing, net 30.", items: [] };
    setQuotes((current) => [newQuote, ...current]);
    setCreateOpen(false);
    setFormError("");
    notify(`${newQuote.number} created. Add products to configure pricing.`);
    navigate(`/quotes/${id}`);
  };
  const updateQuote = useCallback((updated) => setQuotes((current) => current.map((quote) => quote.id === updated.id ? updated : quote)), []);
  const duplicateQuote = useCallback((quote) => {
    const id = `quote-${Date.now()}`;
    const nextNumber = Math.max(1042, ...quotes.map((item) => Number(item.number.replace("LF-", "")))) + 1;
    const clone = { ...quote, id, number: `LF-${nextNumber}`, title: `${quote.title} copy`, status: "Draft", created: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }), items: quote.items.map((item) => ({ ...item, id: `${item.id}-copy-${Date.now()}` })) };
    setQuotes((current) => [clone, ...current]);
    notify(`${clone.number} duplicated as a draft.`);
    navigate(`/quotes/${id}`);
  }, [navigate, notify, quotes]);
  const confirmDeleteQuote = () => {
    setQuotes((current) => current.filter((quote) => quote.id !== deleteQuote.id));
    setDeleteQuote(null);
    notify(`${deleteQuote.number} was removed.`);
    if (location.pathname === `/quotes/${deleteQuote.id}`) navigate("/quotes");
  };
  const routeProps = { quotes, catalog, setCatalog, updateQuote, duplicateQuote, onDeleteQuote: setDeleteQuote, notify };

  return (
    <div className={styles.app}>
      <Header onNewQuote={() => setCreateOpen(true)} />
      <main className={styles.main}><AppRoutes {...routeProps} onNewQuote={() => setCreateOpen(true)} /></main>
      <Footer />
      <Toast toast={toast} onClose={() => setToast(null)} />
      <Modal isOpen={createOpen} title="Start a new quote" description="Set the customer and purpose. You can add products in the quote builder." onClose={() => { setCreateOpen(false); setFormError(""); }} size="medium">
        <form className={styles.createForm} onSubmit={addQuote}>
          <label>Customer company<input name="company" placeholder="e.g. Northstar Studio" required autoFocus /></label>
          <div className={styles.formRow}><label>Primary contact<input name="contact" placeholder="Full name" required /></label><label>Contact email<input name="email" type="email" placeholder="name@company.com" required /></label></div>
          <label>Quote title<input name="title" placeholder="e.g. Team workspace renewal" required /></label>
          {formError && <p className={styles.formError} role="alert">{formError}</p>}
          <div className={styles.formActions}><button type="button" className={styles.secondaryButton} onClick={() => setCreateOpen(false)}>Cancel</button><button type="submit" className={styles.primaryButton}>Create draft</button></div>
        </form>
      </Modal>
      <ConfirmationDialog isOpen={Boolean(deleteQuote)} title="Delete this quote?" itemName={deleteQuote?.number} description="This quote will be removed for this session." confirmLabel="Delete quote" onCancel={() => setDeleteQuote(null)} onConfirm={confirmDeleteQuote} />
    </div>
  );
};

export default App;
