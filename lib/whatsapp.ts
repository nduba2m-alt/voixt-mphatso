export function buildTicketWhatsAppLink(
  phone: string,
  name: string,
  ticketNumber: string,
  ticketType: string
): string {
  const text = encodeURIComponent(
    `Hi ${name}! 🎶 Your MPHATSO concert ticket is ready!\n\n` +
    `🎫 Ticket: ${ticketNumber}\n` +
    `👤 Name: ${name}\n` +
    `🎟️ Type: ${ticketType.toUpperCase()}\n` +
    `📅 Date: Saturday, 1 August 2026\n\n` +
    `Your QR code ticket is attached. Present it at the door.\n` +
    `See you there! — VOIXT 🙏`
  );
  const clean = phone.replace(/\D/g, "");
  const intl = clean.startsWith("0") ? "26" + clean : clean;
  return `https://wa.me/${intl}?text=${text}`;
}

export function buildSupportWhatsAppLink(reference: string): string {
  const adminNum = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "";
  const text = encodeURIComponent(
    `Hi, I've submitted payment for reference ${reference}`
  );
  return `https://wa.me/${adminNum}?text=${text}`;
}
