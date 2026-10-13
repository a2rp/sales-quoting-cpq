import { useMemo, useState } from "react";
import { FiEdit2, FiPackage, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { formatMoney } from "../../data/quotes";
import Modal from "../../components/modal";
import ConfirmationDialog from "../../components/confirmationDialog";
import styles from "./styles.module.css";

const blankProduct = { name: "", sku: "", category: "Software", description: "", unitPrice: "", unitCost: "", billing: "annual license", maxDiscount: 10 };
const categories = ["All products", "Software", "Add-ons", "Services"];

const CatalogPage = ({ catalog, setCatalog, notify }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All products");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [productDraft, setProductDraft] = useState(blankProduct);
  const [removeProduct, setRemoveProduct] = useState(null);
  const [error, setError] = useState("");
  const filtered = useMemo(() => catalog.filter((product) => (category === "All products" || product.category === category) && [product.name, product.sku, product.description].some((value) => value.toLowerCase().includes(search.trim().toLowerCase()))), [catalog, category, search]);

  const startCreate = () => { setEditing(null); setError(""); setProductDraft({ ...blankProduct, sku: `LF-NEW-${String(catalog.length + 1).padStart(2, "0")}` }); setEditorOpen(true); };
  const startEdit = (product) => { setEditing(product); setError(""); setProductDraft({ ...product }); setEditorOpen(true); };
  const submitProduct = (event) => {
    event.preventDefault();
    const price = Number(productDraft.unitPrice);
    const cost = Number(productDraft.unitCost);
    const maxDiscount = Number(productDraft.maxDiscount);
    if (!productDraft.name.trim() || !productDraft.sku.trim() || !Number.isFinite(price) || price <= 0 || !Number.isFinite(cost) || cost < 0 || maxDiscount < 0 || maxDiscount > 50) { setError("Enter a name, SKU, positive price, valid cost, and a discount cap from 0% to 50%."); return; }
    const next = { ...productDraft, name: productDraft.name.trim(), sku: productDraft.sku.trim().toUpperCase(), unitPrice: price, unitCost: cost, maxDiscount };
    if (editing) { setCatalog((current) => current.map((product) => product.id === editing.id ? { ...next, id: editing.id } : product)); notify(`${next.name} updated. Existing quote prices remain unchanged.`); }
    else { const id = `product-${Date.now()}`; setCatalog((current) => [{ ...next, id }, ...current]); notify(`${next.name} added to the catalog.`); }
    setEditorOpen(false);
  };
  const confirmDelete = () => { setCatalog((current) => current.filter((product) => product.id !== removeProduct.id)); notify(`${removeProduct.name} removed from the catalog.`); setRemoveProduct(null); };
  const updateDraft = (key, value) => setProductDraft((current) => ({ ...current, [key]: value }));

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>Workspace <span>/</span> Product catalog</div>
      <section className={styles.heading}><div><p className={styles.eyebrow}>PRICING FOUNDATION</p><h1>Product catalog</h1><p>Keep products, unit costs, and discount limits ready for every quote.</p></div><button className={styles.primary} type="button" onClick={startCreate}><FiPlus /> Add product</button></section>
      <section className={styles.stats}><article><span>Catalog items</span><strong>{catalog.length}</strong></article><article><span>Software products</span><strong>{catalog.filter((item) => item.category === "Software").length}</strong></article><article><span>Services and add-ons</span><strong>{catalog.filter((item) => item.category !== "Software").length}</strong></article><article className={styles.policy}><span><FiPackage /> Price snapshots</span><p>Quote line items keep their saved price if a catalog product changes later.</p></article></section>
      <section className={styles.panel}>
        <div className={styles.toolbar}><label className={styles.search}><FiSearch /><input aria-label="Search catalog" placeholder="Find a product or SKU" value={search} onChange={(event) => setSearch(event.target.value)} /></label><div className={styles.categories} aria-label="Filter by category">{categories.map((item) => <button type="button" key={item} className={category === item ? styles.active : ""} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
        <div className={styles.grid}>{filtered.map((product) => {
          const margin = product.unitPrice ? Math.round((product.unitPrice - product.unitCost) / product.unitPrice * 100) : 0;
          return <article key={product.id} className={styles.productCard}>
            <div className={styles.cardTop}><span className={styles.category}>{product.category}</span><div><button type="button" title={`Edit ${product.name}`} aria-label={`Edit ${product.name}`} onClick={() => startEdit(product)}><FiEdit2 /></button><button type="button" title={`Delete ${product.name}`} aria-label={`Delete ${product.name}`} onClick={() => setRemoveProduct(product)}><FiTrash2 /></button></div></div>
            <p className={styles.sku}>{product.sku}</p><h2>{product.name}</h2><p className={styles.description}>{product.description}</p>
            <div className={styles.priceRow}><strong>{formatMoney(product.unitPrice)}</strong><span>{product.billing}</span></div>
            <div className={styles.detailRow}><span>Internal cost</span><strong>{formatMoney(product.unitCost)}</strong></div><div className={styles.detailRow}><span>Estimated margin</span><strong className={styles.margin}>{margin}%</strong></div><div className={styles.detailRow}><span>Max line discount</span><strong>{product.maxDiscount}%</strong></div>
          </article>;
        })}</div>
        {!filtered.length && <div className={styles.empty}><FiSearch /><h2>No products found</h2><p>Try a different search or category.</p><button type="button" onClick={() => { setSearch(""); setCategory("All products"); }}>Clear filters</button></div>}
        <div className={styles.foot}>{filtered.length} of {catalog.length} catalog items · session changes reset on refresh</div>
      </section>
      <Modal isOpen={editorOpen} title={editing ? "Edit catalog product" : "Add catalog product"} description="Set the list price and discount ceiling used by new quote line items." onClose={() => setEditorOpen(false)} size="large">
        <form className={styles.form} onSubmit={submitProduct}>
          <div className={styles.formGrid}><label>Product name<input autoFocus value={productDraft.name} onChange={(event) => updateDraft("name", event.target.value)} required /></label><label>SKU<input value={productDraft.sku} onChange={(event) => updateDraft("sku", event.target.value)} required /></label><label>Category<select value={productDraft.category} onChange={(event) => updateDraft("category", event.target.value)}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><label>Billing description<input value={productDraft.billing} onChange={(event) => updateDraft("billing", event.target.value)} required /></label><label>Unit price (USD)<input type="number" min="0.01" step="0.01" value={productDraft.unitPrice} onChange={(event) => updateDraft("unitPrice", event.target.value)} required /></label><label>Internal cost (USD)<input type="number" min="0" step="0.01" value={productDraft.unitCost} onChange={(event) => updateDraft("unitCost", event.target.value)} required /></label><label>Maximum discount (%)<input type="number" min="0" max="50" value={productDraft.maxDiscount} onChange={(event) => updateDraft("maxDiscount", event.target.value)} required /></label><label className={styles.full}>Description<textarea rows="3" value={productDraft.description} onChange={(event) => updateDraft("description", event.target.value)} /></label></div>
          {error && <p className={styles.error} role="alert">{error}</p>}<div className={styles.formActions}><button type="button" onClick={() => setEditorOpen(false)}>Cancel</button><button type="submit" className={styles.primary}>{editing ? "Save product" : "Add product"}</button></div>
        </form>
      </Modal>
      <ConfirmationDialog isOpen={Boolean(removeProduct)} title="Remove catalog product?" itemName={removeProduct?.name} description="Existing quote line items will keep their saved product and price snapshots." confirmLabel="Remove product" onCancel={() => setRemoveProduct(null)} onConfirm={confirmDelete} />
    </div>
  );
};
export default CatalogPage;
