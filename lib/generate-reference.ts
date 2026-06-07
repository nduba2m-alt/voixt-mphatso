export function generateReference(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const r = () => letters[Math.floor(Math.random() * letters.length)];
  const d = () => digits[Math.floor(Math.random() * digits.length)];
  return `IMP-${r()}${r()}${d()}${d()}${r()}${r()}`;
}
