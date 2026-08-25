import type { Currency, DocType, Lang } from "./types";

export const DISCLAIMER_EN =
  "This is a simple invoice/quotation, not a ZATCA-certified e-invoice. Not tax advice.";

export const DISCLAIMER_AR =
  "هذه فاتورة/عرض سعر مبسّط، وليست فاتورة إلكترونية معتمدة من هيئة الزكاة والضريبة والجمارك. ليست استشارة ضريبية.";

export const copy = {
  ar: {
    appName: "سند",
    appNameEn: "Sanad",
    tagline: "فواتير وعروض أسعار بسيطة للشركات الصغيرة في السعودية والخليج",
    langToggle: "English",
    invoice: "فاتورة",
    quotation: "عرض سعر",
    seller: "بيانات منشأتك",
    client: "بيانات العميل",
    details: "بيانات المستند",
    items: "البنود",
    preview: "معاينة المستند",
    businessName: "اسم المنشأة",
    clientName: "اسم العميل",
    vatNumber: "الرقم الضريبي",
    crNumber: "السجل التجاري",
    address: "العنوان",
    phone: "الجوال",
    email: "البريد",
    docNumber: "رقم المستند",
    issueDate: "التاريخ",
    dueDate: "تاريخ الاستحقاق",
    validUntil: "ساري حتى",
    currency: "العملة",
    notes: "ملاحظات",
    notesPlaceholder: "شروط الدفع أو ملاحظات تظهر في أسفل المستند",
    applyVat: "إضافة ضريبة القيمة المضافة 15٪",
    discount: "خصم",
    description: "الوصف",
    qty: "الكمية",
    unitPrice: "سعر الوحدة",
    lineTotal: "الإجمالي",
    addItem: "إضافة بند",
    remove: "حذف",
    downloadPdf: "تنزيل PDF",
    print: "طباعة",
    reset: "مستند جديد",
    sample: "تعبئة مثال",
    subtotal: "المجموع قبل الضريبة",
    vat: "ضريبة القيمة المضافة 15٪",
    total: "الإجمالي المستحق",
    quotedTotal: "إجمالي عرض السعر",
    from: "من",
    to: "إلى",
    billTo: "فاتورة إلى",
    quoteTo: "عرض سعر إلى",
    item: "البند",
    watermark: "صُنع بواسطة سند",
    watermarkEn: "Made with Sanad",
    disclaimer: DISCLAIMER_AR,
    disclaimerEn: DISCLAIMER_EN,
    noItems: "أضف بنوداً لعرضها هنا",
    preparing: "جاري تجهيز ملف PDF…",
    savedLocal: "يُحفظ عملك في هذا المتصفح فقط. لا يوجد خادم ولا مدفوعات.",
    notZatca: "سند لا يُصدر فواتير إلكترونية معتمدة من الزكاة والضريبة والجمارك.",
    optional: "اختياري",
  },
  en: {
    appName: "Sanad",
    appNameEn: "سند",
    tagline: "Simple invoices and quotations for Saudi and Gulf small businesses",
    langToggle: "العربية",
    invoice: "Invoice",
    quotation: "Quotation",
    seller: "Your business",
    client: "Client",
    details: "Document",
    items: "Line items",
    preview: "Document preview",
    businessName: "Business name",
    clientName: "Client name",
    vatNumber: "VAT number",
    crNumber: "CR number",
    address: "Address",
    phone: "Phone",
    email: "Email",
    docNumber: "Document number",
    issueDate: "Date",
    dueDate: "Due date",
    validUntil: "Valid until",
    currency: "Currency",
    notes: "Notes",
    notesPlaceholder: "Payment terms or notes shown at the bottom of the document",
    applyVat: "Add 15% VAT",
    discount: "Discount",
    description: "Description",
    qty: "Qty",
    unitPrice: "Unit price",
    lineTotal: "Total",
    addItem: "Add item",
    remove: "Remove",
    downloadPdf: "Download PDF",
    print: "Print",
    reset: "New document",
    sample: "Load sample",
    subtotal: "Subtotal",
    vat: "VAT 15%",
    total: "Amount due",
    quotedTotal: "Quoted total",
    from: "From",
    to: "To",
    billTo: "Bill to",
    quoteTo: "Quote to",
    item: "Item",
    watermark: "Made with Sanad",
    watermarkEn: "صُنع بواسطة سند",
    disclaimer: DISCLAIMER_EN,
    disclaimerEn: DISCLAIMER_AR,
    noItems: "Add line items to show them here",
    preparing: "Preparing PDF…",
    savedLocal: "Your work stays in this browser only. No server and no payments.",
    notZatca: "Sanad does not issue ZATCA-certified e-invoices.",
    optional: "optional",
  },
} as const;

export function t(lang: Lang) {
  return copy[lang];
}

export function docTitle(lang: Lang, type: DocType) {
  return type === "invoice" ? t(lang).invoice : t(lang).quotation;
}

export const currencyMeta: Record<
  Currency,
  { ar: string; en: string; locale: string }
> = {
  SAR: { ar: "ر.س", en: "SAR", locale: "ar-SA" },
  AED: { ar: "د.إ", en: "AED", locale: "ar-AE" },
  KWD: { ar: "د.ك", en: "KWD", locale: "ar-KW" },
  BHD: { ar: "د.ب", en: "BHD", locale: "ar-BH" },
  OMR: { ar: "ر.ع", en: "OMR", locale: "ar-OM" },
  QAR: { ar: "ر.ق", en: "QAR", locale: "ar-QA" },
  USD: { ar: "دولار", en: "USD", locale: "en-US" },
};

export function formatMoney(amount: number, currency: Currency, lang: Lang) {
  const digits = currency === "KWD" || currency === "BHD" || currency === "OMR" ? 3 : 2;
  const formatted = new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount || 0);
  const code = lang === "ar" ? currencyMeta[currency].ar : currencyMeta[currency].en;
  return lang === "ar" ? `${formatted} ${code}` : `${code} ${formatted}`;
}

export function formatDate(iso: string, lang: Lang) {
  if (!iso) return "—";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
