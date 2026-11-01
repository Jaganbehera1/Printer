import { useCallback, useRef, useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, FileText, FileUp, Printer, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FileUploadField from '@/components/print/FileUploadField';
import PdfPreview from '@/components/print/PdfPreview';
import PrintOptionsFields from '@/components/print/PrintOptionsFields';
import { createPrintJob, type NewPrintJob } from '@/services/printJobService';
import { uploadPrintFile } from '@/services/storageService';
import type { PrintSettings } from '@/types/printSettings';
import { generateJobId } from '@/utils/jobId';
import { getUserErrorMessage } from '@/utils/errors';
import { resolvePageSelection } from '@/utils/pageRange';
import { findSupportedFileType, validatePrintFile } from '@/utils/fileValidation';
import { formatFileSize } from '@/utils/format';
import { validatePrintForm, type PrintFormErrors, type PrintFormValues } from '@/utils/validation';

interface PrintRequestFormProps {
  settings: PrintSettings;
}

export default function PrintRequestForm({ settings }: PrintRequestFormProps) {
  const navigate = useNavigate();
  const [values, setValues] = useState<PrintFormValues>(() => ({
    copies: '1',
    pageMode: 'ALL',
    pageRange: '',
    printMode: settings.defaultPrintMode,
    duplex: settings.defaultDuplex,
    orientation: 'PORTRAIT',
  }));
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState<PrintFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const updateValues = (patch: Partial<PrintFormValues>) => {
    setValues((previous) => ({ ...previous, ...patch }));
  };

  const onDocumentReady = useCallback((count: number) => {
    setPageCount(count);
    setPdfLoading(false);
    setCurrentPage((previous) => Math.min(previous, Math.max(1, count)));
  }, []);
  const pages =
    values.pageMode === 'CURRENT'
      ? pageCount > 0
        ? { ok: true as const, value: String(currentPage) }
        : { ok: false as const, error: 'Load a PDF preview before choosing the current page.' }
      : resolvePageSelection(values.pageMode, values.pageRange);
  const fileType = file ? findSupportedFileType(file.name) : undefined;
  const isPdf = fileType?.extension === 'pdf';
  const estimate = pageCount > 0
    ? `${values.pageMode === 'ALL' ? `${pageCount} ${pageCount === 1 ? 'page' : 'pages'}` : values.pageMode === 'CURRENT' ? '1 page' : 'Selected pages'} · ${Number(values.copies) || 1} ${Number(values.copies) === 1 ? 'copy' : 'copies'}`
    : 'Page count available for PDFs';

  const handleFileChange = async (nextFile: File | null) => {
    setFile(nextFile);
    setPageCount(0);
    setPdfLoading(nextFile ? findSupportedFileType(nextFile.name)?.extension === 'pdf' : false);
    setCurrentPage(1);
    updateValues({ pageMode: 'ALL' });
    setErrors((previous) => ({ ...previous, file: undefined }));
    if (!nextFile) return;
    const fileError = await validatePrintFile(nextFile, settings);
    if (fileError) {
      setFile(null);
      setPdfLoading(false);
      setErrors((previous) => ({ ...previous, file: fileError }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitError(null);

    try {
      const fieldErrors = validatePrintForm(values, settings, currentPage);
      const fileError = file ? await validatePrintFile(file, settings) : 'Please choose a file to upload.';
      const allErrors: PrintFormErrors = fileError ? { ...fieldErrors, file: fileError } : fieldErrors;
      setErrors(allErrors);
      if (!file || !pages.ok || Object.keys(allErrors).length > 0) return;

      setSubmitting(true);
      const jobId = generateJobId();
      const uploaded = await uploadPrintFile(jobId, file, setProgress);

      const job: NewPrintJob = {
        jobId,
        fileName: file.name,
        storagePath: uploaded.storagePath,
        fileUrl: uploaded.fileUrl,
        fileSize: file.size,
        copies: Number(values.copies),
        pageSelection: pages.value,
        printMode: values.printMode,
        duplex: values.duplex,
        orientation: values.orientation,
      };
      await createPrintJob(job, settings.printApprovalRequired ? 'WAITING_APPROVAL' : 'APPROVED');
      navigate(`/success/${jobId}`);
    } catch (error) {
      setSubmitError(getUserErrorMessage(error));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
      setProgress(null);
    }
  };

  const buttonLabel = submitting
    ? progress !== null && progress < 100
      ? `Uploading ${progress}%`
      : 'Submitting request'
    : 'Print Document';

  return (
    <form onSubmit={handleSubmit} noValidate className="min-w-0 pb-36 min-[1025px]:pb-0">
      <div className="grid min-w-0 gap-4 min-[1025px]:grid-cols-[minmax(0,7fr)_minmax(18rem,3fr)] min-[1025px]:items-start">
        <div className="min-w-0 space-y-4">
          <Card className="border-primary-100/80 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <FileUp className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-base font-bold text-neutral-900">{file ? 'Document' : 'Choose a document'}</h2>
                <p className="text-xs text-neutral-500">PDF, Office files, images or text</p>
              </div>
            </div>
            <div className="mt-4">
              <FileUploadField
                file={file}
                onChange={handleFileChange}
                error={errors.file}
                maxFileSizeMb={settings.maxFileSize}
                disabled={submitting}
              />
            </div>
          </Card>

          {file && (
            <div className="min-w-0 space-y-3">
              <div className="flex min-w-0 items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-3 shadow-sm sm:px-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error-50 text-error-700">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-neutral-900" title={file.name}>{file.name}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-neutral-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{isPdf ? pageCount ? `${pageCount} ${pageCount === 1 ? 'page' : 'pages'}` : pdfLoading ? 'Reading PDF…' : 'PDF preview unavailable' : `${fileType?.label ?? 'File'} · ready to upload`}</span>
                  </p>
                </div>
                {pageCount > 0 && <CheckCircle2 className="h-5 w-5 shrink-0 text-success-600" aria-label="PDF ready" />}
              </div>
              {isPdf ? (
                <PdfPreview
                  file={file}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  onDocumentReady={onDocumentReady}
                />
              ) : (
                <div className="flex items-start gap-3 rounded-xl border border-primary-100 bg-primary-50/70 p-4 text-sm text-primary-900">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <p>Preview is available for PDF files. This file will be uploaded and converted by the Print Agent if its format is supported.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="min-w-0 space-y-4">
          <details open className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                  <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-base font-bold text-neutral-900">Print Settings</span>
                  <span className="block text-xs text-neutral-500">Choose how your document is printed</span>
                </span>
              </span>
              <ChevronDown className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
            </summary>
            <div className="space-y-5 border-t border-neutral-100 px-4 py-4 sm:px-5">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
                  <Printer className="h-4 w-4 text-primary-700" aria-hidden="true" />
                  Printer
                </div>
                <p className="mt-1 text-sm text-neutral-700">Automatically assigned by the Print Agent</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500">Printer selection is managed on the printer computer.</p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-sm font-semibold text-neutral-800">Paper size</p>
                <select
                  aria-label="Paper size"
                  disabled
                  value="unavailable"
                  className="mt-2 min-h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-600 disabled:cursor-not-allowed disabled:opacity-75"
                >
                  <option value="unavailable">Managed by printer (unavailable here)</option>
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="Letter">Letter</option>
                </select>
                <p className="mt-1 text-xs leading-5 text-neutral-500">The current Print Agent does not accept a paper-size setting.</p>
              </div>
              <PrintOptionsFields
                values={values}
                errors={errors}
                maxCopies={settings.maxCopies}
                currentPage={currentPage}
                hasPdfPreview={pageCount > 0}
                onChange={updateValues}
              />
            </div>
          </details>

          {submitError && <Alert>{submitError}</Alert>}

          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-20px_rgba(11,31,58,0.5)] backdrop-blur min-[1025px]:static min-[1025px]:rounded-2xl min-[1025px]:border-0 min-[1025px]:bg-transparent min-[1025px]:p-0 min-[1025px]:shadow-none min-[1025px]:backdrop-blur-none">
            <div className="mx-auto mb-2 flex max-w-2xl items-center justify-between gap-3 min-[1025px]:hidden">
              <span className="flex min-w-0 items-center gap-2 text-xs font-semibold text-neutral-700">
                <Printer className="h-4 w-4 shrink-0 text-primary-700" aria-hidden="true" />
                <span className="truncate">Printer selected on printer computer</span>
              </span>
              <span className="shrink-0 text-right text-xs text-neutral-500">{estimate}</span>
            </div>
            <Button type="submit" size="lg" fullWidth loading={submitting} className="mx-auto max-w-2xl min-[1025px]:max-w-none">
              {buttonLabel}
            </Button>
            <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] leading-4 text-neutral-500 min-[1025px]:max-w-none">
              {settings.printApprovalRequired ? 'Your request will be sent for approval.' : 'Your request will be sent to the Print Agent.'}
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}
