export const generateQueueNumber = () => {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${month}${day}-${random}`;
};

export const generateQueueTicket = async (queueNumber: string) => {
  const { default: jsPDF } = await import('jspdf');
  
  // 48mm = 1.89 inches = 136 points
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [48, 70], // Width: 48mm, Height: adjust as needed
    putOnlyUsedFonts: true
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 2;
  let yPos = margin;

  // Add store name
  /* doc.setFontSize(10);
  doc.text("Burger Chain", pageWidth / 2, yPos + 4, { align: 'center' });
  yPos += 8; */

  // Add divider
  doc.setLineWidth(0.1);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 4;

  // Add Queue Number label
  doc.setFontSize(8);
  doc.text("MBBF", pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;

  // Add the queue number in larger text
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(queueNumber, pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;

  // Add date and time
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text(
    new Date().toLocaleString(),
    pageWidth / 2,
    yPos,
    { align: 'center' }
  );
  yPos += 2;

  // Add divider
  doc.line(margin, yPos, pageWidth - margin, yPos);
 /*  yPos += 3; */

  // Add thank you message
  /* doc.setFontSize(8);
  doc.text("Please wait for your number", pageWidth / 2, yPos, { align: 'center' });
  yPos += 3;
  doc.text("to be called", pageWidth / 2, yPos, { align: 'center' }); */

  return doc;
};

export const printQueueTicket = async (queueNumber: string) => {
  try {
    const doc = await generateQueueTicket(queueNumber);
    doc.autoPrint();
    doc.output('dataurlnewwindow');
  } catch (error) {
    console.error('Error printing queue ticket:', error);
  }
}; 