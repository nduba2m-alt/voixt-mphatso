export function formatTicketNumber(seq: number): string {
  return `IMP-2026-${String(seq).padStart(5, "0")}`;
}
