"use client";

import jsPDF from "jspdf";

interface TicketData {
  ticketNumber: string;
  attendeeName: string;
  ticketType: string;
  qrCodeDataURL: string;
  venueName?: string;
}

export function generateTicketPDF(ticket: TicketData): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });

  // Background
  doc.setFillColor(10, 8, 4);
  doc.rect(0, 0, 148, 210, "F");

  // Gold border
  doc.setDrawColor(201, 168, 76);
  doc.setLineWidth(1.5);
  doc.rect(8, 8, 132, 194);

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(201, 168, 76);
  doc.text("VOIXT", 74, 28, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(154, 143, 120);
  doc.text("P R E S E N T S", 74, 34, { align: "center" });

  doc.setFontSize(36);
  doc.setTextColor(232, 201, 122);
  doc.text("MPHATSO", 74, 50, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(154, 143, 120);
  doc.text("ALBUM LAUNCH CONCERT", 74, 58, { align: "center" });

  // Divider
  doc.setDrawColor(201, 168, 76);
  doc.setLineWidth(0.5);
  doc.line(20, 62, 128, 62);

  // QR Code
  if (ticket.qrCodeDataURL) {
    doc.addImage(ticket.qrCodeDataURL, "PNG", 44, 67, 60, 60);
  }

  // Ticket details
  const detailY = 135;
  doc.setFontSize(8);
  doc.setTextColor(154, 143, 120);
  doc.text("TICKET NUMBER", 74, detailY, { align: "center" });
  doc.setFontSize(14);
  doc.setTextColor(201, 168, 76);
  doc.text(ticket.ticketNumber, 74, detailY + 7, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(154, 143, 120);
  doc.text("ATTENDEE", 74, detailY + 15, { align: "center" });
  doc.setFontSize(12);
  doc.setTextColor(245, 240, 232);
  doc.text(ticket.attendeeName.toUpperCase(), 74, detailY + 22, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(154, 143, 120);
  doc.text("TICKET TYPE", 74, detailY + 30, { align: "center" });
  doc.setFontSize(12);
  doc.setTextColor(232, 201, 122);
  doc.text(ticket.ticketType.toUpperCase(), 74, detailY + 37, { align: "center" });

  // Divider
  doc.line(20, detailY + 42, 128, detailY + 42);

  // Event details
  doc.setFontSize(9);
  doc.setTextColor(245, 240, 232);
  doc.text("Saturday, 1 August 2026  ·  5:00 PM – 7:00 PM", 74, detailY + 50, { align: "center" });
  doc.setFontSize(8);
  doc.setTextColor(154, 143, 120);
  doc.text(ticket.venueName ?? "Lusaka, Zambia", 74, detailY + 57, { align: "center" });

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(139, 105, 20);
  doc.text("Present this ticket at the door · #Mphatso2026", 74, detailY + 67, { align: "center" });

  return doc;
}
