export type SourceFormat = "jpg" | "png" | "heic";

// Longest side capped at ~11in @ 72dpi, so any photo becomes a normal, printable page
// instead of a PDF page sized in raw pixels.
const MAX_PAGE_POINTS = 792;

async function heicToJpegBytes(file: File): Promise<Uint8Array> {
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.92,
  });
  const blob = Array.isArray(result) ? result[0] : result;
  return new Uint8Array(await blob.arrayBuffer());
}

export async function convertImagesToPdf(
  files: File[],
  format: SourceFormat,
): Promise<Uint8Array> {
  const { PDFDocument } = await import("@cantoo/pdf-lib");
  const pdf = await PDFDocument.create();

  for (const file of files) {
    const bytes =
      format === "heic"
        ? await heicToJpegBytes(file)
        : new Uint8Array(await file.arrayBuffer());
    const embedded =
      format === "png" ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);

    const scale = MAX_PAGE_POINTS / Math.max(embedded.width, embedded.height);
    const width = embedded.width * scale;
    const height = embedded.height * scale;

    const page = pdf.addPage([width, height]);
    page.drawImage(embedded, { x: 0, y: 0, width, height });
  }

  return pdf.save();
}
