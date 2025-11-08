import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import certificateImage from "@/assets/certificate.jpg";

interface CertificateProps {
  donorName: string;
}

const Certificate: React.FC<CertificateProps> = ({ donorName }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadAsPNG = () => {
    if (certificateRef.current) {
      html2canvas(certificateRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = "certificate.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  const downloadAsPDF = () => {
    if (certificateRef.current) {
      html2canvas(certificateRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("l", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save("certificate.pdf");
      });
    }
  };

  return (
    <div className="p-4">
      <div
        ref={certificateRef}
        className="relative w-full max-w-4xl mx-auto"
        style={{
          aspectRatio: "1.414 / 1",
          backgroundImage: `url(${certificateImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center pt-12">
          <h1 className="text-6xl font-certificate text-gray-800">
            {donorName}
          </h1>
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <Button onClick={downloadAsPNG}>Download as PNG</Button>
        <Button onClick={downloadAsPDF}>Download as PDF</Button>
      </div>
    </div>
  );
};

export default Certificate;
