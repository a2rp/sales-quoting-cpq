import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiCheck, FiClock, FiCornerUpLeft, FiFileText, FiSearch } from "react-icons/fi";
import { formatMoney, getQuoteTotals } from "../../data/quotes";
import Modal from "../../components/modal";
import styles from "./styles.module.css";

const ApprovalsPage = ({ quotes, updateQuote, notify }) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [decision, setDecision] = useState("approve");
  const [comment, setComment] = useState("");
  const reviewQuotes = useMemo(() => quotes.filter((quote) => ["In review", "Needs changes"].includes(quote.status)).filter((quote) => [quote.company, quote.number, quote.contact, quote.title].some((value) => value.toLowerCase().includes(search.trim().toLowerCase()))), [quotes, search]);
  const openDecision = (quote, nextDecision) => { setSelected(quote); setDecision(nextDecision); setComment(quote.notes || ""); };
  const completeDecision = (event) => {
    event.preventDefault();
    const updated = { ...selected, status: decision === "approve" ? "Approved" : "Needs changes", notes: comment.trim() };
    updateQuote(updated);
    notify(decision === "approve" ? `${updated.number} approved for the next step.` : `${updated.number} returned with review notes.`);
    setSelected(null);
  };
  const waiting = quotes.filter((quote) => quote.status === "In review").length;
  const returned = quotes.filter((quote) => quote.status === "Needs changes").length;
  const reviewed = quotes.filter((quote) => quote.status === "Approved").length;

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>Workspace <span>/</span> Approvals</div>
      <section className={styles.heading}><div><p className={styles.eyebrow}>COMMERCIAL GOVERNANCE</p><h1>Review with context.</h1><p>Check quote totals, discount levels, and margin before a decision.</p></div><span className={styles.reviewChip}><FiClock /> {waiting} waiting</span></section>
      <section className={styles.metrics}><article><span>Waiting for review</span><strong>{waiting}</strong><small>Quotes submitted for approval</small></article><article><span>Returned for changes</span><strong>{returned}</strong><small>Follow-up needed from sales</small></article><article><span>Approved this session</span><strong>{reviewed}</strong><small>Ready for the next sales step</small></article></section>
      <section className={styles.panel}>
        <div className={styles.panelHeading}><div><h2>Review queue</h2><p>Decisions update the demo quote status only. No external notification is sent.</p></div><label className={styles.search}><FiSearch /><input aria-label="Search approval queue" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a quote or company" /></label></div>
        {reviewQuotes.length ? <div className={styles.list}>{reviewQuotes.map((quote) => {
          const totals = getQuoteTotals(quote);
          const discount = quote.discount + quote.items.reduce((best, item) => Math.max(best, item.discount), 0);
          return <article className={styles.reviewCard} key={quote.id}>
            <div className={styles.cardMain}><div className={styles.icon}><FiFileText /></div><div className={styles.identity}><div className={styles.titleLine}><h3>{quote.company}</h3><span className={quote.status === "In review" ? styles.waiting : styles.returned}>{quote.status}</span></div><p>{quote.number} <span>·</span> {quote.title}</p><small>{quote.contact} · {quote.email}</small></div></div>
            <div className={styles.figures}><div><span>Estimated total</span><strong>{formatMoney(totals.total)}</strong></div><div><span>Gross margin</span><strong>{totals.marginPercent}%</strong></div><div><span>Largest discount</span><strong className={discount > 20 ? styles.flag : ""}>{discount}%</strong></div></div>
            <div className={styles.actions}><Link to={`/quotes/${quote.id}`}>View quote <FiArrowUpRight /></Link><button type="button" className={styles.returnButton} onClick={() => openDecision(quote, "changes")}><FiCornerUpLeft /> Request changes</button><button type="button" className={styles.approveButton} onClick={() => openDecision(quote, "approve")}><FiCheck /> Approve</button></div>
          </article>;
        })}</div> : <div className={styles.empty}><span><FiCheck /></span><h2>Queue is clear</h2><p>There are no quotes waiting for review. Check back when a quote is submitted.</p><Link to="/quotes">Return to quotes</Link></div>}
        <div className={styles.foot}>Approval decisions apply to this page session only.</div>
      </section>
      <Modal isOpen={Boolean(selected)} title={decision === "approve" ? "Approve quote" : "Return quote for changes"} description={`${selected?.number} · ${selected?.company}. Add a note to include with this demo decision.`} onClose={() => setSelected(null)} size="medium">
        <form className={styles.decisionForm} onSubmit={completeDecision}><label>Review note<textarea rows="4" value={comment} onChange={(event) => setComment(event.target.value)} placeholder={decision === "approve" ? "Optional note for the sales team" : "Explain what should change before approval"} required={decision === "changes"} /></label><div className={styles.formActions}><button type="button" onClick={() => setSelected(null)}>Cancel</button><button className={decision === "approve" ? styles.approveButton : styles.returnButton} type="submit">{decision === "approve" ? <><FiCheck /> Approve quote</> : <><FiCornerUpLeft /> Return with notes</>}</button></div></form>
      </Modal>
    </div>
  );
};
export default ApprovalsPage;
