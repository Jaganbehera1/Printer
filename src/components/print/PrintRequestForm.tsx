import { useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FileUploadField from '@/components/print/FileUploadField';
import PrintOptionsFields from '@/components/print/PrintOptionsFields';
import PrintSummary from '@/components/print/PrintSummary';
import { createPrintJob, type NewPrintJob } from '@/services/printJobService';
import { uploadPrintFile } from '@/services/storageService';
import type { PrintSettings } from '@/types/printSettings';
import { generateJobId } from '@/utils/jobId';
import { getUserErrorMessage } from '@/utils/errors';
import { resolvePageSelection } from '@/utils/pageRange';
import { validatePrintFile } from '@/utils/fileValidation';
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
  }));
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<PrintFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const updateValues = (patch: Partial<PrintFormValues>) => {
    setValues((previous) => ({ ...previous, ...patch }));
  };

  const pages = resolvePageSelection(values.pageMode, values.pageRange);
  const pagesLabel = pages.ok ? (pages.value === 'ALL' ? 'All pages' : pages.value) : values.pageRange || '-';

  const handleFileChange = async (nextFile: File | null) => {
    setFile(nextFile);
    setErrors((previous) => ({ ...previous, file: undefined }));
    if (!nextFile) return;
    const fileError = await validatePrintFile(nextFile, settings);
    if (fileError) {
      setFile(null);
      setErrors((previous) => ({ ...previous, file: fileError }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitError(null);

    try {
      const fieldErrors = validatePrintForm(values, settings);
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
    : 'Submit print request';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Card>
        <StepTitle number={1} title="Your file" />
        <div className="mt-5">
          <FileUploadField
            file={file}
            onChange={handleFileChange}
            error={errors.file}
            maxFileSizeMb={settings.maxFileSize}
            disabled={submitting}
          />
        </div>
      </Card>

      <Card>
        <StepTitle number={2} title="Print options" />
        <div className="mt-5">
          <PrintOptionsFields
            values={values}
            errors={errors}
            maxCopies={settings.maxCopies}
            onChange={updateValues}
          />
        </div>
      </Card>

      <Card>
        <StepTitle number={3} title="Summary" />
        <div className="mt-5">
          <PrintSummary
            fileName={file?.name ?? null}
            fileSize={file?.size ?? null}
            pagesLabel={pagesLabel}
            copies={Number(values.copies) || 0}
            printMode={values.printMode}
            duplex={values.duplex}
          />
        </div>
      </Card>

      {submitError && <Alert>{submitError}</Alert>}

      <div className="sticky bottom-0 -mx-4 border-t border-neutral-200 bg-white/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <Button type="submit" size="lg" fullWidth loading={submitting} className="uppercase tracking-wide">
          {buttonLabel}
        </Button>
      </div>
    </form>
  );
}

function StepTitle({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
        {number}
      </span>
      <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
    </div>
  );
}
