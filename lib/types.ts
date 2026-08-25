export type Lang = "ar" | "en";
export type DocType = "invoice" | "quotation";
export type Currency = "SAR" | "AED" | "KWD" | "BHD" | "OMR" | "QAR" | "USD";

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type Party = {
  name: string;
  vatNumber: string;
  crNumber: string;
  address: string;
  phone: string;
  email: string;
};

export type DocumentState = {
  type: DocType;
  number: string;
  issueDate: string;
  dueDate: string;
  currency: Currency;
  applyVat: boolean;
  discount: number;
  notes: string;
  seller: Party;
  client: Party;
  items: LineItem[];
};

export type Totals = {
  subtotal: number;
  discount: number;
  taxable: number;
  vat: number;
  total: number;
};
