import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Printer } from 'lucide-react';
import { generateQueueTicket } from '@/utils/queue-generator';

interface QueueTicketPreviewProps {
  queueNumber: string;
}

export function QueueTicketPreview({ queueNumber }: QueueTicketPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPreview = async () => {
      if (!canvasRef.current) return;

      const doc = await generateQueueTicket(queueNumber);
      const pdfData = doc.output('datauristring');

      // Create an image from the PDF
      const img = new Image();
      img.src = pdfData;
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw PDF preview
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    };

    renderPreview();
  }, [queueNumber]);

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Queue Ticket Preview</h3>
        <canvas 
          ref={canvasRef}
          width={196} // 52mm at 96 DPI
          height={113} // 30mm at 96 DPI
          className="w-full border rounded bg-white"
        />
        <Button 
          className="w-full text-xs h-8"
          variant="secondary"
          onClick={() => generateQueueTicket(queueNumber).then(doc => {
            doc.autoPrint();
            doc.output('dataurlnewwindow');
          })}
        >
          <Printer className="mr-1 h-3 w-3" />
          Print Queue Ticket
        </Button>
      </div>
    </Card>
  );
} 