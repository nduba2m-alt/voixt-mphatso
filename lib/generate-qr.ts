import QRCode from "qrcode";

export async function generateQRCodeDataURL(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: "H",
    margin: 2,
    color: { dark: "#0A0804", light: "#F5F0E8" },
    width: 300,
  });
}

export async function generateQRCodeBuffer(text: string): Promise<Buffer> {
  return QRCode.toBuffer(text, {
    errorCorrectionLevel: "H",
    margin: 2,
    color: { dark: "#0A0804", light: "#F5F0E8" },
    width: 300,
  });
}
