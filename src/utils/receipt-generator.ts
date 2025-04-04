import { Receipt } from '@/types/receipt';

export const generateReceipt = async (receipt: Receipt) => {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [48, 200],
    putOnlyUsedFonts: true
  });

  // Add monospace font
  //doc.setFont('courier', 'normal');

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 2;
  let yPos = margin;
  
  // Header
  //doc.setFont('courier', 'normal');
  doc.setFontSize(10);
  doc.text("Migoy's Burger", pageWidth / 2, yPos + 4, { align: 'center' });
  yPos += 8;

  // Receipt details
  //doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.text(`Receipt #: ${receipt.id}`, margin, yPos);
  yPos += 4;
  doc.text(`Date: ${receipt.date.toLocaleString()}`, margin, yPos);
  yPos += 6;

  // Add queue number to receipt
  //doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.text(`Queue #: ${receipt.queueNumber}`, margin, yPos);
  yPos += 2;

  // Items
  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Item', 'Qty', 'Total']],
    body: receipt.items.map(item => [
      item.product.name,
      item.quantity.toString(),
      formatCurrency(item.product.price * item.quantity)
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 1,
      lineWidth: 0, // Removed border lines
      lineColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: false,
      textColor: [0, 0, 0],
      fontStyle: 'normal',
    },
    columnStyles: {
      0: { cellWidth: 23 },
      1: { cellWidth: 7, halign: 'center' },
      2: { cellWidth: 15, halign: 'right' }, // Ensure total header is justified right
    },
    theme: 'plain'
  });

  yPos = (doc as any).lastAutoTable.finalY + 4;

  // Totals section
  //doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.text("Subtotal:", margin, yPos);
  doc.text(formatCurrency(receipt.subtotal), pageWidth - margin, yPos, { align: 'right' });
  yPos += 4;

  doc.text("Tax:", margin, yPos);
  doc.text(formatCurrency(receipt.tax), pageWidth - margin, yPos, { align: 'right' });
  yPos += 4;

  // Total amount
  //doc.setFont('courier', 'bold');
  doc.text("Total:", margin, yPos);
  doc.text(formatCurrency(receipt.total), pageWidth - margin, yPos, { align: 'right' });
  yPos += 5;

  // Payment details
  //doc.setFont('courier', 'normal');
  doc.text("Cash:", margin, yPos);
  doc.text(formatCurrency(receipt.amountPaid), pageWidth - margin, yPos, { align: 'right' });
  yPos += 4;

  //doc.setFont('courier', 'bold');
  doc.text("Change:", margin, yPos);
  doc.text(formatCurrency(receipt.change), pageWidth - margin, yPos, { align: 'right' });
  yPos += 6;

  // Footer
  //doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.text("Thank you for your purchase!", pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Add divider
  doc.setLineWidth(0.1);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 5;

  // Add Queue Number label
  doc.setFontSize(8);
  doc.text("MBBF", pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;

  // Add the queue number in larger text
  doc.setFontSize(14);
  //doc.setFont('courier', 'bold');
  doc.text(receipt.queueNumber, pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;

  // Add date and time
  doc.setFontSize(8);
  //doc.setFont('courier', 'normal');
  doc.text(
    new Date().toLocaleString(),
    pageWidth / 2,
    yPos,
    { align: 'center' }
  );
  yPos += 2;

  return doc;
};

export const printReceipt = async (receipt: Receipt) => {
  try {
    const doc = await generateReceipt(receipt);
    // Open in new window for printing
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        URL.revokeObjectURL(url);
      };
    }
  } catch (error) {
    console.error('Error printing receipt:', error);
  }
};

export const downloadReceipt = async (receipt: Receipt) => {
  try {
    const doc = await generateReceipt(receipt);
    doc.save(`receipt-${receipt.id}.pdf`);
  } catch (error) {
    console.error('Error downloading receipt:', error);
  }
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
} 