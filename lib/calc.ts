import type { DocumentState, LineItem, Totals } from "./types";

export const VAT_RATE = 0.15;

export function lineTotal(item: LineItem) {
  const qty = Number(item.quantity) || 0;
  const price = Number(item.unitPrice) || 0;
  return roundMoney(qty * price);
}

export function computeTotals(doc: DocumentState): Totals {
  const subtotal = roundMoney(doc.items.reduce((sum, item) => sum + lineTotal(item), 0));
  const discount = Math.min(Math.max(Number(doc.discount) || 0, 0), subtotal);
  const taxable = roundMoney(subtotal - discount);
  const vat = doc.applyVat ? roundMoney(taxable * VAT_RATE) : 0;
  return {
    subtotal,
    discount,
    taxable,
    vat,
    total: roundMoney(taxable + vat),
  };
}

export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 1000) / 1000;
}

export function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function addDaysIso(iso: string, days: number) {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyItem(): LineItem {
  return { id: newId(), description: "", quantity: 1, unitPrice: 0 };
}

export function nextDocNumber(type: DocumentState["type"]) {
  const stamp = todayIso().replace(/-/g, "");
  const suffix = String(Math.floor(Math.random() * 900) + 100);
  return `${type === "invoice" ? "INV" : "QTN"}-${stamp}-${suffix}`;
}
