import { ArrowRight, FileUp, ListChecks, Search, ShieldCheck, Printer } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FormField, { TextInput } from '@/components/ui/FormField';
import { JOB_ID_PATTERN } from '@/utils/jobId';

const STEPS = [
  { icon: FileUp, title: 'Upload your file', text: 'Choose the PDF, Word, Excel, image or text file you want printed.' },
  { icon: ListChecks, title: 'Pick your options', text: 'Set copies, pages, colour and sides.' },
  { icon: ShieldCheck, title: 'Wait for approval', text: 'The office reviews your request before anything is printed.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [jobCode, setJobCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  const handleLookup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = jobCode.trim().toUpperCase();
    if (!JOB_ID_PATTERN.test(code)) {
      setCodeError('Enter a request ID like PR-20261028-0001.');
      return;
    }
    navigate(`/status/${code}`);
  };

  return (
    <div>
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-16">
          <p className="text-sm font-medium text-primary-700">Fast • Simple • Paperless Print Requests</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            School Smart Print
          </h1>
          <p className="mt-4 max-w-xl text-base leading-normal text-neutral-600 sm:text-lg">
            Send your document to the school printer from your phone in under a minute. Scan the code by the printer or
            tap the button below to get started.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/print" className="sm:w-auto">
              <Button size="lg" fullWidth className="sm:w-auto">
                Start a print request
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Card className="flex flex-col">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-50 text-secondary-700">
              <Search className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-neutral-900">Check a request</h2>
            <p className="mt-1 text-sm leading-normal text-neutral-600">
              Enter the request ID shown on your confirmation screen.
            </p>
            <form onSubmit={handleLookup} noValidate className="mt-5 space-y-3">
              <FormField label="Request ID" htmlFor="jobCode" error={codeError}>
                <TextInput
                  id="jobCode"
                  placeholder="PR-20261028-0001"
                  autoCapitalize="characters"
                  autoComplete="off"
                  value={jobCode}
                  invalid={!!codeError}
                  onChange={(event) => {
                    setJobCode(event.target.value);
                    setCodeError(null);
                  }}
                />
              </FormField>
              <Button type="submit" variant="secondary" fullWidth>
                Check status
              </Button>
            </form>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {STEPS.map(({ icon: Icon, title, text }, index) => (
              <Card key={title} className="flex gap-4 p-5 sm:flex-col sm:p-5 lg:flex-row">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Step {index + 1}</p>
                  <h3 className="mt-1 text-base font-semibold text-neutral-900">{title}</h3>
                  <p className="mt-1 text-sm leading-normal text-neutral-600">{text}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <p className="mt-10 flex items-center justify-center gap-2 text-xs text-neutral-500">
          <Printer className="h-3.5 w-3.5" aria-hidden="true" />
          Nothing is printed until the office approves your request.
        </p>
      </section>
    </div>
  );
}
