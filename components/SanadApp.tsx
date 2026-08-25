"use client";

import { DocumentPreview } from "@/components/DocumentPreview";
import { emptyItem, nextDocNumber } from "@/lib/calc";
import {
  createBlankDocument,
  createSampleDocument,
  hydrationDocument,
  loadDocument,
  loadLang,
  saveDocument,
  saveLang,
} from "@/lib/document";
import { currencyMeta, t } from "@/lib/i18n";
import { downloadElementPdf } from "@/lib/pdf";
import type { Currency, DocumentState, Lang, Party } from "@/lib/types";
import { useEffect, useMemo, useRef, useState } from "react";

export function SanadApp() {
  const [lang, setLang] = useState<Lang>("ar");
  const [doc, setDoc] = useState<DocumentState>(hydrationDocument);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const sheetRef = useRef<HTMLElement>(null);
  const labels = useMemo(() => t(lang), [lang]);

  useEffect(() => {
    setDoc(loadDocument() ?? createBlankDocument());
    setLang(loadLang());
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    saveLang(lang);
  }, [lang]);

  useEffect(() => {
    if (ready) saveDocument(doc);
  }, [doc, ready]);

  function patch<K extends keyof DocumentState>(key: K, value: DocumentState[K]) {
    setDoc((current) => ({ ...current, [key]: value }));
  }

  function patchParty(side: "seller" | "client", key: keyof Party, value: string) {
    setDoc((current) => ({
      ...current,
      [side]: { ...current[side], [key]: value },
    }));
  }

  function patchItem(id: string, key: "description" | "quantity" | "unitPrice", value: string) {
    setDoc((current) => ({
      ...current,
      items: current.items.map((item) => {
        if (item.id !== id) return item;
        if (key === "description") return { ...item, description: value };
        return { ...item, [key]: Number(value) || 0 };
      }),
    }));
  }

  async function onDownload() {
    if (!sheetRef.current) return;
    setBusy(true);
    try {
      await downloadElementPdf(sheetRef.current, `${doc.number || "sanad"}.pdf`);
    } finally {
      setBusy(false);
    }
  }

  function onPrint() {
    window.print();
  }

  return (
    <div className={`app ${busy ? "busy" : ""}`}>
      <header className="topbar no-print">
        <div className="brand">
          <div className="seal" aria-hidden="true">
            س
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-display), serif" }}>
              {labels.appName}
              <span style={{ marginInlineStart: 8, color: "var(--gold)", fontSize: 18 }}>
                {labels.appNameEn}
              </span>
            </h1>
            <p>{labels.tagline}</p>
          </div>
        </div>
        <div className="toolbar">
          <button className="btn ghost" type="button" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>
            {labels.langToggle}
          </button>
          <button className="btn ghost" type="button" onClick={() => setDoc(createSampleDocument(lang))}>
            {labels.sample}
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() =>
              setDoc({
                ...createBlankDocument(),
                type: doc.type,
                number: nextDocNumber(doc.type),
              })
            }
          >
            {labels.reset}
          </button>
          <button className="btn" type="button" onClick={onPrint}>
            {labels.print}
          </button>
          <button className="btn gold" type="button" onClick={onDownload} disabled={busy}>
            {busy ? labels.preparing : labels.downloadPdf}
          </button>
        </div>
      </header>

      <div className="layout">
        <div className="stack no-print">
          <section className="panel">
            <h2>{labels.details}</h2>
            <div className="seg" role="tablist" aria-label={labels.details}>
              <button
                type="button"
                className={doc.type === "invoice" ? "active" : ""}
                onClick={() =>
                  setDoc((current) => ({
                    ...current,
                    type: "invoice",
                    number: current.type === "invoice" ? current.number : nextDocNumber("invoice"),
                  }))
                }
              >
                {labels.invoice}
              </button>
              <button
                type="button"
                className={doc.type === "quotation" ? "active" : ""}
                onClick={() =>
                  setDoc((current) => ({
                    ...current,
                    type: "quotation",
                    number: current.type === "quotation" ? current.number : nextDocNumber("quotation"),
                  }))
                }
              >
                {labels.quotation}
              </button>
            </div>
            <div className="grid-2" style={{ marginTop: 14 }}>
              <label className="field">
                <span>{labels.docNumber}</span>
                <input value={doc.number} onChange={(e) => patch("number", e.target.value)} />
              </label>
              <label className="field">
                <span>{labels.currency}</span>
                <select
                  value={doc.currency}
                  onChange={(e) => patch("currency", e.target.value as Currency)}
                >
                  {(Object.keys(currencyMeta) as Currency[]).map((code) => (
                    <option key={code} value={code}>
                      {code} — {lang === "ar" ? currencyMeta[code].ar : currencyMeta[code].en}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>{labels.issueDate}</span>
                <input type="date" value={doc.issueDate} onChange={(e) => patch("issueDate", e.target.value)} />
              </label>
              <label className="field">
                <span>{doc.type === "invoice" ? labels.dueDate : labels.validUntil}</span>
                <input type="date" value={doc.dueDate} onChange={(e) => patch("dueDate", e.target.value)} />
              </label>
              <label className="field">
                <span>{labels.discount}</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={doc.discount || ""}
                  onChange={(e) => patch("discount", Number(e.target.value) || 0)}
                />
              </label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={doc.applyVat}
                  onChange={(e) => patch("applyVat", e.target.checked)}
                />
                {labels.applyVat}
              </label>
            </div>
            <label className="field" style={{ marginTop: 12 }}>
              <span>{labels.notes}</span>
              <textarea
                value={doc.notes}
                placeholder={labels.notesPlaceholder}
                onChange={(e) => patch("notes", e.target.value)}
              />
            </label>
          </section>

          <section className="panel">
            <h2>{labels.seller}</h2>
            <PartyFields side="seller" doc={doc} lang={lang} onChange={patchParty} />
          </section>

          <section className="panel">
            <h2>{labels.client}</h2>
            <PartyFields side="client" doc={doc} lang={lang} onChange={patchParty} />
          </section>

          <section className="panel">
            <h2>{labels.items}</h2>
            <div className="stack">
              {doc.items.map((item) => (
                <div className="grid-3 item-row" key={item.id}>
                  <label className="field">
                    <span>{labels.description}</span>
                    <input
                      value={item.description}
                      onChange={(e) => patchItem(item.id, "description", e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>{labels.qty}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => patchItem(item.id, "quantity", e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>{labels.unitPrice}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice || ""}
                      onChange={(e) => patchItem(item.id, "unitPrice", e.target.value)}
                    />
                  </label>
                  <button
                    className="btn danger"
                    type="button"
                    onClick={() =>
                      setDoc((current) => ({
                        ...current,
                        items: current.items.filter((row) => row.id !== item.id).concat(
                          current.items.length === 1 ? [emptyItem()] : [],
                        ),
                      }))
                    }
                  >
                    {labels.remove}
                  </button>
                </div>
              ))}
              <button
                className="btn primary"
                type="button"
                onClick={() => setDoc((current) => ({ ...current, items: [...current.items, emptyItem()] }))}
              >
                {labels.addItem}
              </button>
            </div>
          </section>
        </div>

        <aside className="preview-wrap">
          <div className="preview-head no-print">
            <h2>{labels.preview}</h2>
          </div>
          <DocumentPreview ref={sheetRef} doc={doc} lang={lang} />
          <p className="fineprint no-print">
            {labels.savedLocal} {labels.notZatca}
          </p>
        </aside>
      </div>
    </div>
  );
}

function PartyFields({
  side,
  doc,
  lang,
  onChange,
}: {
  side: "seller" | "client";
  doc: DocumentState;
  lang: Lang;
  onChange: (side: "seller" | "client", key: keyof Party, value: string) => void;
}) {
  const labels = t(lang);
  const party = doc[side];
  return (
    <div className="grid-2">
      <label className="field">
        <span>{side === "seller" ? labels.businessName : labels.clientName}</span>
        <input value={party.name} onChange={(e) => onChange(side, "name", e.target.value)} />
      </label>
      <label className="field">
        <span>
          {labels.vatNumber} ({labels.optional})
        </span>
        <input value={party.vatNumber} onChange={(e) => onChange(side, "vatNumber", e.target.value)} />
      </label>
      <label className="field">
        <span>
          {labels.crNumber} ({labels.optional})
        </span>
        <input value={party.crNumber} onChange={(e) => onChange(side, "crNumber", e.target.value)} />
      </label>
      <label className="field">
        <span>{labels.phone}</span>
        <input value={party.phone} onChange={(e) => onChange(side, "phone", e.target.value)} />
      </label>
      <label className="field">
        <span>{labels.email}</span>
        <input value={party.email} onChange={(e) => onChange(side, "email", e.target.value)} />
      </label>
      <label className="field">
        <span>{labels.address}</span>
        <input value={party.address} onChange={(e) => onChange(side, "address", e.target.value)} />
      </label>
    </div>
  );
}
