export const generateQueueNumber = () => {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${month}${day}-${random}`;
};

export const generateQueueTicket = async (queueNumber: string) => {
  const { default: jsPDF } = await import('jspdf');
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [48, 70],
    putOnlyUsedFonts: true
  });

  // Add monospace font
  //doc.setFont('courier', 'normal');

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 2;
  let yPos = margin;

  // Add divider
  doc.setLineWidth(0.1);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 3;

  // Add Queue Number label
  doc.setFontSize(8);
  doc.text("MBBF", pageWidth / 2, yPos, { align: 'center' });
  yPos += 4;

  // Add the queue number in larger text
  doc.setFontSize(14);
  //doc.setFont('courier', 'bold');
  doc.text(queueNumber, pageWidth / 2, yPos, { align: 'center' });
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

  // Add divider
  doc.line(margin, yPos, pageWidth - margin, yPos);

  return doc;
};

/* export const printQueueTicket = async (queueNumber: string) => {
  try {
    const doc = await generateQueueTicket(queueNumber);
    doc.autoPrint();
    doc.output('dataurlnewwindow');
  } catch (error) {
    console.error('Error printing queue ticket:', error);
  }
};  */

export const printQueueTicket = async (queueNumber: string) => {
  try {
    const doc = await generateQueueTicket(queueNumber);
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
    console.error('Error printing queue:', error);
  }
};
