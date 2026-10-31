import { Download, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface QRCodeCardProps {
  brandName: string;
}

export default function QRCodeCard({ brandName }: QRCodeCardProps) {
  const printUrl = `${window.location.origin}/print`;
  const [preview, setPreview] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(printUrl, { width: 320, margin: 2, errorCorrectionLevel: 'M' })
      .then((url) => {
        if (active) setPreview(url);
      })
      .catch(() => {
        if (active) setPreviewError(true);
      });
    return () => {
      active = false;
    };
  }, [printUrl]);

  const handleDownload = async () => {
    setDownloadError(null);
    setDownloading(true);
    try {
      const url = await QRCode.toDataURL(printUrl, { width: 1200, margin: 4, errorCorrectionLevel: 'H' });
      const link = document.createElement('a');
      link.href = url;
      link.download = 'print-service-qr-code.png';
      link.click();
    } catch {
      setDownloadError('The QR code could not be created. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-50 text-secondary-700">
          <QrCode className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Printer QR code</h2>
          <p className="text-sm text-neutral-500">Scan this code to open the print page.</p>
        </div>
      </div>

      <div className="flex min-w-0 flex-col items-center rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-center sm:p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">{brandName}</p>
        <p className="mt-1 text-lg font-semibold text-neutral-900">Scan to print</p>
        <div className="mt-4 flex aspect-square w-full max-w-[280px] items-center justify-center rounded-xl bg-white p-2">
          {preview ? (
            <img src={preview} alt={`QR code linking to ${printUrl}`} className="h-full w-full object-contain" />
          ) : previewError ? (
            <p className="text-sm text-error-700">The QR code preview is unavailable.</p>
          ) : (
            <p className="text-sm text-neutral-500">Creating QR code...</p>
          )}
        </div>
        <p className="mt-4 break-all text-xs text-neutral-500">{printUrl}</p>
      </div>

      {downloadError && <Alert>{downloadError}</Alert>}

      <Button variant="secondary" fullWidth loading={downloading} onClick={handleDownload}>
        <Download className="h-4 w-4" aria-hidden="true" />
        Download QR Code
      </Button>
      <p className="text-xs leading-normal text-neutral-500">
        The downloaded image is high resolution, so it prints clearly at A4 or A5 size.
      </p>
    </Card>
  );
}
