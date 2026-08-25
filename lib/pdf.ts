export async function downloadElementPdf(element: HTMLElement, filename: string) {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    windowWidth: element.scrollWidth,
    logging: false,
  });

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;
  const image = canvas.toDataURL("image/jpeg", 0.95);

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
}
