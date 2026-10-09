import QRCode from "qrcode";

export interface QrRenderOptions {
  size: number;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  dark: string;
  light: string;
}

export async function renderQrToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  opts: QrRenderOptions,
  logoImage?: HTMLImageElement | null,
): Promise<void> {
  canvas.width = opts.size;
  canvas.height = opts.size;

  if (!text) {
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  await QRCode.toCanvas(canvas, text, {
    width: opts.size,
    margin: 2,
    errorCorrectionLevel: opts.errorCorrectionLevel,
    color: { dark: opts.dark, light: opts.light },
  });

  if (logoImage) {
    const ctx = canvas.getContext("2d")!;
    const logoSize = Math.round(opts.size * 0.2);
    const x = (opts.size - logoSize) / 2;
    const y = (opts.size - logoSize) / 2;
    const pad = Math.round(logoSize * 0.12);
    ctx.fillStyle = opts.light;
    ctx.fillRect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2);
    ctx.drawImage(logoImage, x, y, logoSize, logoSize);
  }
}
