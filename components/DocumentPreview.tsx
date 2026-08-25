import { computeTotals, lineTotal } from "@/lib/calc";
import { DISCLAIMER_AR, DISCLAIMER_EN, docTitle, formatDate, formatMoney, t } from "@/lib/i18n";
import type { DocumentState, Lang } from "@/lib/types";
import { forwardRef } from "react";

type Props = {
  doc: DocumentState;
  lang: Lang;
};

export const DocumentPreview = forwardRef<HTMLElement, Props>(function DocumentPreview(
  { doc, lang },
  ref,
) {
  const labels = t(lang);
  const totals = computeTotals(doc);
  const visibleItems = doc.items.filter(
    (item) => item.description.trim() || item.unitPrice || item.quantity !== 1,
  );
  const seller = doc.seller;
  const client = doc.client;
  const dateLabel = doc.type === "invoice" ? labels.dueDate : labels.validUntil;
  const partyLabel = doc.type === "invoice" ? labels.billTo : labels.quoteTo;
  const totalLabel = doc.type === "invoice" ? labels.total : labels.quotedTotal;

  return (
    <article ref={ref} className="sheet" id="sanad-document">
      <header className="doc-head">
        <div>
          <p className="doc-kicker">سند · SANAD</p>
          <h1 className="doc-title">{docTitle(lang, doc.type)}</h1>
        </div>
        <div className="doc-meta">
          <div>
            <strong>{labels.docNumber}:</strong> {doc.number || "—"}
          </div>
          <div>
            <strong>{labels.issueDate}:</strong> {formatDate(doc.issueDate, lang)}
          </div>
          <div>
            <strong>{dateLabel}:</strong> {formatDate(doc.dueDate, lang)}
          </div>
        </div>
      </header>

      <div className="parties">
        <section>
          <h3>{labels.from}</h3>
          <strong>{seller.name || "—"}</strong>
          {seller.vatNumber ? (
            <p>
              {labels.vatNumber}: {seller.vatNumber}
            </p>
          ) : null}
          {seller.crNumber ? (
            <p>
              {labels.crNumber}: {seller.crNumber}
            </p>
          ) : null}
          {seller.address ? <p>{seller.address}</p> : null}
          {seller.phone ? <p>{seller.phone}</p> : null}
          {seller.email ? <p>{seller.email}</p> : null}
        </section>
        <section>
          <h3>{partyLabel}</h3>
          <strong>{client.name || "—"}</strong>
          {client.vatNumber ? (
            <p>
              {labels.vatNumber}: {client.vatNumber}
            </p>
          ) : null}
          {client.crNumber ? (
            <p>
              {labels.crNumber}: {client.crNumber}
            </p>
          ) : null}
          {client.address ? <p>{client.address}</p> : null}
          {client.phone ? <p>{client.phone}</p> : null}
          {client.email ? <p>{client.email}</p> : null}
        </section>
      </div>

      {visibleItems.length === 0 ? (
        <p className="empty">{labels.noItems}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{labels.item}</th>
              <th className="num">{labels.qty}</th>
              <th className="num">{labels.unitPrice}</th>
              <th className="num">{labels.lineTotal}</th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((item) => (
              <tr key={item.id}>
                <td>{item.description || "—"}</td>
                <td className="num">{item.quantity || 0}</td>
                <td className="num">{formatMoney(item.unitPrice || 0, doc.currency, lang)}</td>
                <td className="num">{formatMoney(lineTotal(item), doc.currency, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="totals">
        <div>
          <span>{labels.subtotal}</span>
          <span>{formatMoney(totals.subtotal, doc.currency, lang)}</span>
        </div>
        {totals.discount > 0 ? (
          <div>
            <span>{labels.discount}</span>
            <span>- {formatMoney(totals.discount, doc.currency, lang)}</span>
          </div>
        ) : null}
        {doc.applyVat ? (
          <div>
            <span>{labels.vat}</span>
            <span>{formatMoney(totals.vat, doc.currency, lang)}</span>
          </div>
        ) : null}
        <div className="grand">
          <span>{totalLabel}</span>
          <span>{formatMoney(totals.total, doc.currency, lang)}</span>
        </div>
      </div>

      {doc.notes.trim() ? (
        <div className="notes">
          <strong>{labels.notes}</strong>
          <div>{doc.notes}</div>
        </div>
      ) : null}

      <p className="wm">
        {labels.watermark} · {labels.watermarkEn}
      </p>

      <footer className="legal">
        <div>{DISCLAIMER_EN}</div>
        <div>{DISCLAIMER_AR}</div>
      </footer>
    </article>
  );
});
