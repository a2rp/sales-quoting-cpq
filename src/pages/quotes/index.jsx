import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowDownRight, FiArrowUpRight, FiCopy, FiFileText, FiFilter, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { formatMoney, getQuoteTotals } from "../../data/quotes";
import styles from "./styles.module.css";

const statusOptions = ["All quotes", "Draft", "In review", "Approved", "Sent", "Won", "Needs changes"];
const statusClass = (status) => styles[status.toLowerCase().replaceAll(" ", "-")] || "";

const QuotesPage = ({ quotes, onNewQuote, duplicateQuote, onDeleteQuote }) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All quotes");
  const filteredQuotes = useMemo(() => quotes.filter((quote) => {
    const matchesStatus = status === "All quotes" || quote.status === status;
    const query = search.trim().toLowerCase();
    return matchesStatus && (!query || [quote.number, quote.company, quote.contact, quote.title].some((value) => value.toLowerCase().includes(query)));
  }), [quotes, search, status]);
  const pending = quotes.filter((quote) => quote.status === "In review" || quote.status === "Needs changes").length;
  const pipeline = quotes.filter((quote) => !["Won"].includes(quote.status)).reduce((sum, quote) => sum + getQuoteTotals(quote).total, 0);
  const won = quotes.filter((quote) => quote.status === "Won").reduce((sum, quote) => sum + getQuoteTotals(quote).total, 0);

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>Workspace <span>/</span> Quotes</div>
      <section className={styles.heading}>
        <div><p className={styles.eyebrow}>LINEFORM · REVENUE WORKSPACE</p><h1>Quotes, clearly configured.</h1><p className={styles.intro}>Build customer-ready pricing, keep approvals moving, and see what is in play.</p></div>
        <button className={styles.primary} type="button" onClick={onNewQuote}><FiPlus /> New quote</button>
      </section>
      <section className={styles.metrics} aria-label="Quote summary">
        <article><span>Open pipeline</span><strong>{formatMoney(pipeline)}</strong><small><FiArrowUpRight /> Across {quotes.length} active quote records</small></article>
        <article><span>Needs a review</span><strong>{pending}</strong><small><FiFileText /> Approval queue items</small></article>
        <article><span>Won this period</span><strong>{formatMoney(won)}</strong><small><FiArrowDownRight /> Marked won in this demo</small></article>
      </section>
      <section className={styles.panel}>
        <div className={styles.panelHeading}><div><h2>Quote workspace</h2><p>Search customers, review status, and open a quote to edit its configuration.</p></div><span className={styles.count}>{filteredQuotes.length} quotes</span></div>
        <div className={styles.toolbar}>
          <label className={styles.search}><FiSearch aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search company, quote, or contact" aria-label="Search quotes" /></label>
          <label className={styles.filter}><FiFilter aria-hidden="true" /><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter quotes by status">{statusOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>
        {filteredQuotes.length ? <div className={styles.tableWrap}><table><thead><tr><th>Quote</th><th>Customer</th><th>Status</th><th>Valid until</th><th className={styles.amountHead}>Total</th><th><span className={styles.srOnly}>Actions</span></th></tr></thead><tbody>
          {filteredQuotes.map((quote) => <tr key={quote.id}>
            <td><Link className={styles.quoteLink} to={`/quotes/${quote.id}`}>{quote.number}<span>{quote.title}</span></Link></td>
            <td><strong>{quote.company}</strong><small>{quote.contact}</small></td>
            <td><span className={[styles.status, statusClass(quote.status)].join(" ")}>{quote.status}</span></td>
            <td>{quote.validUntil}</td>
            <td className={styles.amount}>{formatMoney(getQuoteTotals(quote).total)}</td>
            <td><div className={styles.actions}><Link to={`/quotes/${quote.id}`} aria-label={`Open ${quote.number}`} title="Open quote"><FiArrowUpRight /></Link><button type="button" onClick={() => duplicateQuote(quote)} aria-label={`Duplicate ${quote.number}`} title="Duplicate"><FiCopy /></button><button type="button" onClick={() => onDeleteQuote(quote)} aria-label={`Delete ${quote.number}`} title="Delete"><FiTrash2 /></button></div></td>
          </tr>)}
        </tbody></table></div> : <div className={styles.empty}><span><FiSearch /></span><h3>No quotes match</h3><p>Change the search or status filter and try again.</p><button type="button" onClick={() => { setSearch(""); setStatus("All quotes"); }}>Clear filters</button></div>}
        <div className={styles.tableFoot}><span>Session demo · changes reset when the page is refreshed</span><button type="button" onClick={onNewQuote}><FiPlus /> Create a quote</button></div>
      </section>
      <aside className={styles.note}><strong>Pricing policy</strong><p>Discounts above 20% need additional review. Tax is estimated at 8.25% for demonstration and is not a tax calculation service.</p><Link to="/approvals">View approval queue <FiArrowUpRight /></Link></aside>
    </div>
  );
};
export default QuotesPage;

