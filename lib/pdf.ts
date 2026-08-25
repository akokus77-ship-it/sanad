export async function downloadElementPdf(element: HTMLElement, filename: string) {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const host = document.createElement("div");
  const clone = element.cloneNode(true) as HTMLElement;
  host.setAttribute("aria-hidden", "true");
  host.style.cssText =
    "position:fixed;left:-12000px;top:0;width:210mm;background:#fff;pointer-events:none;";
  clone.style.width = "210mm";
  clone.style.maxWidth = "210mm";
  clone.style.minHeight = "297mm";
  clone.style.boxSizing = "border-box";
  host.appendChild(clone);
  document.body.appendChild(host);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      width: clone.scrollWidth,
      windowWidth: clone.scrollWidth,
      logging: false,
    });

    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    const image = canvas.toDataURL("image/jpeg", 0.95);

    if (imgHeight <= pageHeight + 8) {
      pdf.addImage(image, "JPEG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(filename);
      return;
    }

    let remaining = imgHeight;
    let offset = 0;
    pdf.addImage(image, "JPEG", 0, offset, imgWidth, imgHeight);
    remaining -= pageHeight;

    while (remaining > 2) {
      offset -= pageHeight;
      pdf.addPage();
      pdf.addImage(image, "JPEG", 0, offset, imgWidth, imgHeight);
      remaining -= pageHeight;
    }

    pdf.save(filename);
  } finally {
    host.remove();
  }
}
