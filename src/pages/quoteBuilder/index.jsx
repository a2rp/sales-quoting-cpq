import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiDownload, FiEye, FiPlus, FiSave, FiSend, FiShield, FiTrash2 } from "react-icons/fi";
import { catalogSeed, formatMoney, getQuoteTotals, makeQuoteItem } from "../../data/quotes";
import ConfirmationDialog from "../../components/confirmationDialog";
import Modal from "../../components/modal";
import styles from "./styles.module.css";

const QuoteBuilderPage = ({ quotes, catalog, updateQuote, notify }) => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const quoteFromList = quotes.find((item) => item.id === quoteId);
  const [draft, setDraft] = useState(quoteFromList || null);
  const [removeItem, setRemoveItem] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saved, setSaved] = useState(true);

  useEffect(() => { setDraft(quoteFromList || null); setSaved(true); }, [quoteFromList]);
  const products = catalog.length ? catalog : catalogSeed;
  const totals = useMemo(() => draft ? getQuoteTotals(draft) : null, [draft]);
  if (!draft) return <div className={styles.missing}><h1>Quote not found</h1><p>This quote may have been removed from the current session.</p><Link to="/quotes">Back to quotes</Link></div>;

  const updateField = (key, value) => { setDraft((current) => ({ ...current, [key]: value })); setSaved(false); };
  const updateLine = (itemId, key, value) => {
    setDraft((current) => ({ ...current, items: current.items.map((item) => item.id === itemId ? { ...item, [key]: key === "quantity" ? Math.max(1, Number(value) || 1) : key === "discount" ? Math.min(item.maxDiscount, Math.max(0, Number(value) || 0)) : value } : item) }));
    setSaved(false);
  };
  const addProduct = (event) => {
    const product = products.find((item) => item.id === event.target.value);
    if (!product) return;
    setDraft((current) => ({ ...current, items: [...current.items, makeQuoteItem(product, 1)] }));
    setSaved(false);
    notify(`${product.name} added to ${draft.number}.`);
    event.target.value = "";
  };
  const saveDraft = (status = draft.status) => {
    const next = { ...draft, status };
    updateQuote(next);
    setDraft(next);
    setSaved(true);
    notify(status === "In review" ? `${draft.number} sent to the approval queue.` : `${draft.number} saved.`);
  };
  const removeLine = () => {
    setDraft((current) => ({ ...current, items: current.items.filter((item) => item.id !== removeItem.id) }));
    setSaved(false);
    notify(`${removeItem.name} removed from this quote.`);
    setRemoveItem(null);
  };
  const downloadQuote = () => {
    const csvRows = [["Quote", draft.number], ["Customer", draft.company], ["Contact", draft.contact], ["Product", "Quantity", "Unit price", "Discount", "Line total"]];
    draft.items.forEach((item) => csvRows.push([item.name, item.quantity, item.unitPrice, `${item.discount}%`, item.quantity * item.unitPrice * (1 - item.discount / 100)]));
    csvRows.push(["Subtotal", "", "", "", totals.subtotal], ["Estimated tax", "", "", "", totals.tax], ["Total", "", "", "", totals.total]);
    const csv = csvRows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `${draft.number.toLowerCase()}-quote.csv`; link.click(); URL.revokeObjectURL(url);
    notify("Quote summary downloaded as CSV.");
  };

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}><Link to="/quotes"><FiArrowLeft /> Quotes</Link><span>/</span>{draft.number}</div>
      <section className={styles.heading}><div><p className={styles.eyebrow}>QUOTE CONFIGURATION</p><h1>{draft.company}</h1><p>{draft.number} <span>·</span> {draft.title}</p></div><div className={styles.headingActions}><span className={[styles.status, styles[draft.status.toLowerCase().replaceAll(" ", "-")]].join(" ")}>{draft.status}</span><button type="button" className={styles.secondary} onClick={() => setPreviewOpen(true)}><FiEye /> Preview</button><button type="button" className={styles.primary} onClick={() => saveDraft()}><FiSave /> {saved ? "Saved" : "Save changes"}</button></div></section>
      <div className={styles.layout}>
        <div className={styles.mainColumn}>
          <section className={styles.card}>
            <div className={styles.cardHeading}><div><span className={styles.step}>01</span><div><h2>Customer and terms</h2><p>Quote details shown on the proposal summary.</p></div></div><span className={styles.saved}>{saved ? <><FiCheck /> Up to date</> : "Unsaved changes"}</span></div>
            <div className={styles.fields}>
              <label>Company<input value={draft.company} onChange={(event) => updateField("company", event.target.value)} /></label>
              <label>Quote title<input value={draft.title} onChange={(event) => updateField("title", event.target.value)} /></label>
              <label>Primary contact<input value={draft.contact} onChange={(event) => updateField("contact", event.target.value)} /></label>
              <label>Contact email<input type="email" value={draft.email} onChange={(event) => updateField("email", event.target.value)} /></label>
              <label>Valid until<input value={draft.validUntil} onChange={(event) => updateField("validUntil", event.target.value)} /></label>
              <label>Payment terms<input value={draft.terms} onChange={(event) => updateField("terms", event.target.value)} /></label>
              <label className={styles.full}>Customer notes<textarea rows="3" value={draft.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Add context for the proposal" /></label>
            </div>
          </section>
          <section className={styles.card}>
            <div className={styles.cardHeading}><div><span className={styles.step}>02</span><div><h2>Products and services</h2><p>Prices are captured as a snapshot in this quote.</p></div></div><label className={styles.addProduct}><FiPlus /><select value="" onChange={addProduct} aria-label="Add a product"><option value="" disabled>Add product</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name} · {formatMoney(product.unitPrice)}</option>)}</select></label></div>
            {draft.items.length ? <div className={styles.lineItems}><div className={styles.lineHeader}><span>ITEM</span><span>QTY</span><span>UNIT PRICE</span><span>DISC.</span><span>LINE TOTAL</span><span /></div>
              {draft.items.map((item) => <div className={styles.line} key={item.id}>
                <div className={styles.product}><strong>{item.name}</strong><small>{item.sku} · {item.billing}</small></div>
                <label className={styles.qtyLabel}><span className={styles.srOnly}>Quantity for {item.name}</span><input aria-label={`Quantity for ${item.name}`} type="number" min="1" max="9999" value={item.quantity} onChange={(event) => updateLine(item.id, "quantity", event.target.value)} /></label>
                <span className={styles.price}>{formatMoney(item.unitPrice)}</span>
                <label className={styles.discountLabel}><span className={styles.srOnly}>Discount for {item.name}</span><input aria-label={`Discount for ${item.name}`} type="number" min="0" max={item.maxDiscount} value={item.discount} onChange={(event) => updateLine(item.id, "discount", event.target.value)} /><small>%</small></label>
                <strong className={styles.lineTotal}>{formatMoney(item.quantity * item.unitPrice * (1 - item.discount / 100))}</strong>
                <button type="button" className={styles.remove} onClick={() => setRemoveItem(item)} aria-label={`Remove ${item.name}`} title="Remove item"><FiTrash2 /></button>
              </div>)}
              <p className={styles.discountHint}><FiShield /> Line discounts are capped by each product's pricing policy.</p>
            </div> : <div className={styles.noItems}><span><FiPlus /></span><strong>No products yet</strong><p>Add catalog items to calculate pricing and margin.</p></div>}
          </section>
          <section className={styles.card}>
            <div className={styles.cardHeading}><div><span className={styles.step}>03</span><div><h2>Quote-level adjustment</h2><p>Additional discount applied after item-level discounts.</p></div></div></div>
            <div className={styles.adjustment}><label>Additional discount<input type="number" min="0" max="20" value={draft.discount} onChange={(event) => updateField("discount", Math.min(20, Math.max(0, Number(event.target.value) || 0)))} /><span>%</span></label><p>Maximum quote-level discount: 20%. Higher discounts require a separate commercial review.</p></div>
          </section>
        </div>
        <aside className={styles.summary}>
          <div className={styles.summaryTop}><div><p className={styles.eyebrow}>LIVE ESTIMATE</p><h2>Quote summary</h2></div><span>{draft.items.length} items</span></div>
          <div className={styles.totalRows}><div><span>Product value</span><strong>{formatMoney(totals.gross)}</strong></div><div><span>Line discounts</span><strong>−{formatMoney(totals.lineDiscount)}</strong></div><div><span>Quote discount ({draft.discount}%)</span><strong>−{formatMoney(totals.quoteDiscount)}</strong></div><div><span>Estimated tax (8.25%)</span><strong>{formatMoney(totals.tax)}</strong></div><div className={styles.grandTotal}><span>Estimated total</span><strong>{formatMoney(totals.total)}</strong></div></div>
          <div className={styles.margin}><span>Estimated gross margin</span><strong>{totals.marginPercent}%</strong><div><i style={{ width: `${Math.max(0, Math.min(100, totals.marginPercent))}%` }} /></div><small>Estimate based on internal sample costs.</small></div>
          <div className={styles.customer}><span>Prepared for</span><strong>{draft.company}</strong><small>{draft.contact} · {draft.email}</small></div>
          <div className={styles.summaryActions}><button type="button" className={styles.request} disabled={!draft.items.length} onClick={() => saveDraft("In review")}><FiSend /> Request approval</button><button type="button" className={styles.download} onClick={downloadQuote}><FiDownload /> Download CSV summary</button></div>
          <p className={styles.disclaimer}>Frontend demo only. No quote email or external approval is sent.</p>
        </aside>
      </div>
      <ConfirmationDialog isOpen={Boolean(removeItem)} title="Remove this line item?" itemName={removeItem?.name} description="The item will be removed from this quote and the estimate will update." confirmLabel="Remove item" onCancel={() => setRemoveItem(null)} onConfirm={removeLine} />
      <Modal isOpen={previewOpen} title="Proposal preview" description="A customer-facing summary generated from this quote's current session data." onClose={() => setPreviewOpen(false)} size="large">
        <div className={styles.preview}><div className={styles.previewTop}><span className={styles.wordmark}>lineform<span>.</span></span><span>{draft.number}</span></div><p className={styles.eyebrow}>PROPOSAL FOR</p><h2>{draft.company}</h2><p className={styles.previewTitle}>{draft.title}</p><p className={styles.previewContact}>{draft.contact} · {draft.email}</p><div className={styles.previewLines}>{draft.items.map((item) => <div key={item.id}><span>{item.name}<small>{item.quantity} × {formatMoney(item.unitPrice)}{item.discount ? ` · ${item.discount}% off` : ""}</small></span><strong>{formatMoney(item.quantity * item.unitPrice * (1 - item.discount / 100))}</strong></div>)}</div><div className={styles.previewTotal}><span>Estimated total, including tax</span><strong>{formatMoney(totals.total)}</strong></div><p className={styles.previewTerms}>Valid until {draft.validUntil}. {draft.terms}</p></div>
      </Modal>
    </div>
  );
};
export default QuoteBuilderPage;

