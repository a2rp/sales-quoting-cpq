export const catalogSeed = [
  { id: "core-seat", sku: "LF-CORE-01", name: "Core workspace seat", category: "Software", description: "Shared workspace and essential project views.", unitPrice: 480, unitCost: 122, billing: "per seat / year", maxDiscount: 20 },
  { id: "pro-seat", sku: "LF-PRO-02", name: "Pro workspace seat", category: "Software", description: "Advanced controls and team-level reporting.", unitPrice: 840, unitCost: 188, billing: "per seat / year", maxDiscount: 18 },
  { id: "analytics-pack", sku: "LF-ANL-11", name: "Analytics suite", category: "Add-ons", description: "Forecasting, exports, and shared performance views.", unitPrice: 3200, unitCost: 720, billing: "annual add-on", maxDiscount: 15 },
  { id: "onboarding", sku: "LF-ONB-20", name: "Guided onboarding", category: "Services", description: "A structured launch plan with two working sessions.", unitPrice: 2400, unitCost: 1350, billing: "one-time service", maxDiscount: 10 },
  { id: "priority-care", sku: "LF-SUP-03", name: "Priority care", category: "Services", description: "A named support contact and faster response window.", unitPrice: 1800, unitCost: 640, billing: "annual service", maxDiscount: 12 },
  { id: "automation-pack", sku: "LF-AUT-14", name: "Workflow automation pack", category: "Add-ons", description: "Reusable automated workflows for common team tasks.", unitPrice: 5600, unitCost: 1240, billing: "annual add-on", maxDiscount: 16 },
  { id: "migration", sku: "LF-MIG-32", name: "Data migration", category: "Services", description: "One-time import planning and data validation.", unitPrice: 3600, unitCost: 2100, billing: "one-time service", maxDiscount: 8 },
  { id: "security", sku: "LF-SEC-06", name: "Advanced security", category: "Add-ons", description: "Additional access controls and audit exports.", unitPrice: 4200, unitCost: 980, billing: "annual add-on", maxDiscount: 14 },
];

const makeItem = (product, quantity, discount = 0) => ({
  id: `${product.id}-${Math.random().toString(36).slice(2, 7)}`,
  productId: product.id,
  sku: product.sku,
  name: product.name,
  description: product.description,
  billing: product.billing,
  quantity,
  unitPrice: product.unitPrice,
  unitCost: product.unitCost,
  maxDiscount: product.maxDiscount,
  discount,
});

export const quoteSeed = [
  {
    id: "quote-1042", number: "LF-1042", company: "Alder & Finch", contact: "Morgan Reed", email: "morgan.reed@example.com", title: "Workspace suite renewal", status: "In review", created: "Oct 13, 2026", validUntil: "Nov 12, 2026", discount: 8, notes: "Align the new seats with the January planning cycle.", terms: "Annual billing, net 30.", items: [makeItem(catalogSeed[1], 18, 8), makeItem(catalogSeed[2], 1), makeItem(catalogSeed[4], 1)],
  },
  {
    id: "quote-1041", number: "LF-1041", company: "Cedar & Co", contact: "Jamie Wells", email: "jamie.wells@example.com", title: "Analytics team expansion", status: "Draft", created: "Oct 12, 2026", validUntil: "Nov 11, 2026", discount: 0, notes: "", terms: "Annual billing, net 30.", items: [makeItem(catalogSeed[0], 12), makeItem(catalogSeed[2], 1), makeItem(catalogSeed[3], 1)],
  },
  {
    id: "quote-1039", number: "LF-1039", company: "Vela Logistics", contact: "Taylor Brooks", email: "taylor.brooks@example.com", title: "Operations license", status: "Approved", created: "Oct 10, 2026", validUntil: "Nov 09, 2026", discount: 10, notes: "Includes operations team seats and rollout support.", terms: "Annual billing, net 45.", items: [makeItem(catalogSeed[1], 26, 10), makeItem(catalogSeed[5], 1), makeItem(catalogSeed[3], 1)],
  },
  {
    id: "quote-1037", number: "LF-1037", company: "Porchlight Studio", contact: "Alex Kim", email: "alex.kim@example.com", title: "Design tools annual plan", status: "Sent", created: "Oct 08, 2026", validUntil: "Nov 07, 2026", discount: 5, notes: "Follow up after the October 21 review.", terms: "Annual billing, net 30.", items: [makeItem(catalogSeed[1], 14, 5), makeItem(catalogSeed[7], 1)],
  },
  {
    id: "quote-1028", number: "LF-1028", company: "Northwind Assembly", contact: "Robin Ellis", email: "robin.ellis@example.com", title: "Enterprise renewal and security", status: "Won", created: "Oct 02, 2026", validUntil: "Nov 01, 2026", discount: 12, notes: "Approved for the new fiscal year.", terms: "Annual billing, net 45.", items: [makeItem(catalogSeed[1], 42, 12), makeItem(catalogSeed[5], 1), makeItem(catalogSeed[7], 1), makeItem(catalogSeed[4], 1)],
  },
  {
    id: "quote-1024", number: "LF-1024", company: "Fieldnote Health", contact: "Noah Bennett", email: "noah.bennett@example.com", title: "Secure team launch", status: "Needs changes", created: "Sep 29, 2026", validUntil: "Oct 29, 2026", discount: 24, notes: "Revisit the services bundle and bring discount within the review limit.", terms: "Annual billing, net 30.", items: [makeItem(catalogSeed[0], 24, 24), makeItem(catalogSeed[6], 1), makeItem(catalogSeed[7], 1)],
  },
];

export const formatMoney = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value || 0);
export const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export const getQuoteTotals = (quote) => {
  const gross = quote.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const lineDiscount = quote.items.reduce((sum, item) => sum + item.quantity * item.unitPrice * item.discount / 100, 0);
  const net = gross - lineDiscount;
  const quoteDiscount = net * quote.discount / 100;
  const subtotal = roundMoney(net - quoteDiscount);
  const tax = roundMoney(subtotal * 0.0825);
  const cost = roundMoney(quote.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0));
  const margin = roundMoney(subtotal - cost);
  return { gross: roundMoney(gross), lineDiscount: roundMoney(lineDiscount), quoteDiscount: roundMoney(quoteDiscount), subtotal, tax, total: roundMoney(subtotal + tax), cost, margin, marginPercent: subtotal ? roundMoney(margin / subtotal * 100) : 0 };
};

export const makeQuoteItem = makeItem;
