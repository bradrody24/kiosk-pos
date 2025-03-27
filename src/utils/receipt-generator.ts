import { Receipt } from '@/types/receipt';

export const generateReceipt = async (receipt: Receipt) => {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  
  // Create document with initial size
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [52, 200],
    putOnlyUsedFonts: true
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 2;
  let yPos = margin;
  
  // Header
  doc.setFontSize(10);
  doc.text("Burger Chain", pageWidth / 2, yPos + 4, { align: 'center' });
  yPos += 8;

  // Receipt details
  doc.setFontSize(8);
  doc.text(`Receipt #: ${receipt.id}`, margin, yPos);
  yPos += 4;
  doc.text(`Date: ${receipt.date.toLocaleString()}`, margin, yPos);
  yPos += 6;

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
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: false,
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 23 },
      1: { cellWidth: 7, halign: 'center' },
      2: { cellWidth: 18, halign: 'right' },
    },
    theme: 'plain'
  });

  yPos = (doc as any).lastAutoTable.finalY + 4;

  // Totals section
  doc.text("Subtotal:", margin, yPos);
  doc.text(formatCurrency(receipt.subtotal), pageWidth - margin, yPos, { align: 'right' });
  yPos += 4;

  doc.text("Tax:", margin, yPos);
  doc.text(formatCurrency(receipt.tax), pageWidth - margin, yPos, { align: 'right' });
  yPos += 4;

  // Total amount
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text("Total:", margin, yPos);
  doc.text(formatCurrency(receipt.total), pageWidth - margin, yPos, { align: 'right' });
  yPos += 5;

  // Payment details
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text("Cash:", margin, yPos);
  doc.text(formatCurrency(receipt.amountPaid), pageWidth - margin, yPos, { align: 'right' });
  yPos += 4;

  doc.text("Change:", margin, yPos);
  doc.text(formatCurrency(receipt.change), pageWidth - margin, yPos, { align: 'right' });
  yPos += 8;

  // Footer
  doc.setFontSize(8);
  doc.text("Thank you for your purchase!", pageWidth / 2, yPos, { align: 'center' });
  yPos += 4;
  doc.text("Please come again!", pageWidth / 2, yPos, { align: 'center' });

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
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
} 