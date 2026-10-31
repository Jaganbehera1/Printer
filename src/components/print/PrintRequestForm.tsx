import { useRef, useState, type FormEvent } from 'react';
import { ClipboardCheck, FileUp, SlidersHorizontal } from 'lucide-react';
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
    orientation: 'PORTRAIT',
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
    : 'Submit print request';

  return (
    <form onSubmit={handleSubmit} noValidate className="min-w-0 space-y-4 sm:space-y-6">
      <Card className="border-primary-100/80">
        <StepTitle number={1} title="Your file" Icon={FileUp} />
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

      <Card className="border-secondary-100/80">
        <StepTitle number={2} title="Print options" Icon={SlidersHorizontal} />
        <div className="mt-5">
          <PrintOptionsFields
            values={values}
            errors={errors}
            maxCopies={settings.maxCopies}
            onChange={updateValues}
          />
        </div>
      </Card>

      <Card className="border-accent-100/80">
        <StepTitle number={3} title="Summary" Icon={ClipboardCheck} />
        <div className="mt-5">
          <PrintSummary
            fileName={file?.name ?? null}
            fileSize={file?.size ?? null}
            pagesLabel={pagesLabel}
            copies={Number(values.copies) || 0}
            printMode={values.printMode}
            duplex={values.duplex}
            orientation={values.orientation}
          />
        </div>
      </Card>

      {submitError && <Alert>{submitError}</Alert>}

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-neutral-200 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <Button type="submit" size="lg" fullWidth loading={submitting} className="uppercase tracking-wide">
          {buttonLabel}
        </Button>
      </div>
    </form>
  );
}

function StepTitle({ number, title, Icon }: { number: number; title: string; Icon: typeof FileUp }) {
  const tones = [
    'from-primary-500 to-primary-700 shadow-primary-600/20',
    'from-secondary-500 to-secondary-700 shadow-secondary-600/20',
    'from-accent-400 to-accent-600 shadow-accent-600/20',
  ];

  return (
    <div className="flex items-center gap-3">
      <span className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md ${tones[number - 1]}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Step {number}</span>
        <h2 className="mt-0.5 text-base font-bold text-neutral-900">{title}</h2>
      </span>
    </div>
  );
}
