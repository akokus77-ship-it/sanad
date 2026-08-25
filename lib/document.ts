import { addDaysIso, emptyItem, nextDocNumber, todayIso } from "./calc";
import type { DocumentState, Lang, Party } from "./types";

export const STORAGE_KEY = "sanad.document.v1";
export const LANG_KEY = "sanad.lang.v1";

export function emptyParty(): Party {
  return {
    name: "",
    vatNumber: "",
    crNumber: "",
    address: "",
    phone: "",
    email: "",
  };
}

export const hydrationDocument: DocumentState = {
  type: "invoice",
  number: "",
  issueDate: "",
  dueDate: "",
  currency: "SAR",
  applyVat: true,
  discount: 0,
  notes: "",
  seller: emptyParty(),
  client: emptyParty(),
  items: [{ id: "line-1", description: "", quantity: 1, unitPrice: 0 }],
};

export function createBlankDocument(): DocumentState {
  const issueDate = todayIso();
  return {
    type: "invoice",
    number: nextDocNumber("invoice"),
    issueDate,
    dueDate: addDaysIso(issueDate, 14),
    currency: "SAR",
    applyVat: true,
    discount: 0,
    notes: "",
    seller: emptyParty(),
    client: emptyParty(),
    items: [emptyItem()],
  };
}

export function createSampleDocument(lang: Lang): DocumentState {
  const issueDate = todayIso();
  if (lang === "ar") {
    return {
      type: "invoice",
      number: nextDocNumber("invoice"),
      issueDate,
      dueDate: addDaysIso(issueDate, 14),
      currency: "SAR",
      applyVat: true,
      discount: 50,
      notes: "الدفع خلال 14 يوماً عبر تحويل بنكي.",
      seller: {
        name: "مؤسسة أفق للتجارة",
        vatNumber: "300000000000003",
        crNumber: "1010000000",
        address: "الرياض، المملكة العربية السعودية",
        phone: "0500000000",
        email: "hello@afokus.net",
      },
      client: {
        name: "شركة النخيل للخدمات",
        vatNumber: "310000000000003",
        crNumber: "2050000000",
        address: "الدمام، المملكة العربية السعودية",
        phone: "0550000000",
        email: "accounts@example.com",
      },
      items: [
        { id: "sample-1", description: "تصميم هوية بصرية", quantity: 1, unitPrice: 1800 },
        { id: "sample-2", description: "طباعة ملفات تعريف", quantity: 3, unitPrice: 220 },
      ],
    };
  }

  return {
    type: "quotation",
    number: nextDocNumber("quotation"),
    issueDate,
    dueDate: addDaysIso(issueDate, 21),
    currency: "SAR",
    applyVat: true,
    discount: 0,
    notes: "Quote valid for 21 days. Payment by bank transfer.",
    seller: {
      name: "Ufq Trading Est.",
      vatNumber: "300000000000003",
      crNumber: "1010000000",
      address: "Riyadh, Saudi Arabia",
      phone: "0500000000",
      email: "hello@afokus.net",
    },
    client: {
      name: "Palm Services Co.",
      vatNumber: "310000000000003",
      crNumber: "2050000000",
      address: "Dammam, Saudi Arabia",
      phone: "0550000000",
      email: "accounts@example.com",
    },
    items: [
      { id: "sample-1", description: "Brand identity design", quantity: 1, unitPrice: 1800 },
      { id: "sample-2", description: "Printed company profiles", quantity: 3, unitPrice: 220 },
    ],
  };
}

export function loadDocument(): DocumentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DocumentState;
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveDocument(doc: DocumentState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
}

export function loadLang(): Lang {
  if (typeof window === "undefined") return "ar";
  return window.localStorage.getItem(LANG_KEY) === "en" ? "en" : "ar";
}

export function saveLang(lang: Lang) {
  window.localStorage.setItem(LANG_KEY, lang);
}
