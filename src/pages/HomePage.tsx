import { ArrowRight, Check, FileUp, ListChecks, Search, ShieldCheck, Printer, Sparkles, FileText, Clock3 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FormField, { TextInput } from '@/components/ui/FormField';
import { JOB_ID_PATTERN } from '@/utils/jobId';

const STEPS = [
  { icon: FileUp, title: 'Upload your file', text: 'Choose the PDF, Word, Excel, image or text file you want printed.' },
  { icon: ListChecks, title: 'Pick your options', text: 'Set copies, pages, colour, sides and orientation.' },
  { icon: ShieldCheck, title: 'Wait for approval', text: 'An administrator reviews your request before printing.' },
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
    <div className="pb-4">
      <section className="home-hero relative isolate overflow-hidden">
        <div className="hero-grid pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-30 lg:block" />
        <div className="home-hero-content mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-white/90 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent-300" aria-hidden="true" />
              DIGITAL PRINTING · FAST · SIMPLE · PAPERLESS
            </span>
            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:mt-6 sm:text-5xl lg:text-6xl">
              Printing,
              <span className="block bg-gradient-to-r from-yellow-200 via-amber-300 to-red-300 bg-clip-text text-transparent">made simple.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-primary-100 sm:mt-5 sm:text-lg">
              Upload documents from any device, choose your print options, and track every request in one simple workflow.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Link to="/print" className="sm:w-auto">
                <Button variant="primary" size="lg" fullWidth className="shadow-lg shadow-black/10 sm:w-auto">
                  Start a print request
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-primary-100 sm:mt-7 sm:gap-x-6 sm:text-sm">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-success-300" aria-hidden="true" />No personal details</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-accent-300" aria-hidden="true" />Track your request</span>
            </div>
          </div>

          <div className="home-hero-art relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="pointer-events-none absolute -inset-8 rounded-full bg-accent-300/15 blur-3xl" />
            <div className="relative isolate h-[21rem] overflow-hidden rounded-3xl border border-white/25 bg-gradient-to-br from-primary-600 via-primary-800 to-primary-900 shadow-2xl shadow-black/25 sm:h-[24rem] sm:rounded-[2rem]">
              <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full border border-accent-200/25 bg-accent-300/15" />
              <div className="absolute -bottom-28 -left-12 h-72 w-72 rounded-full border border-error-200/20 bg-error-400/15" />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/90 backdrop-blur sm:left-7 sm:top-7">
                <ShieldCheck className="h-3.5 w-3.5 text-success-300" aria-hidden="true" />
                One simple print portal
              </div>
              <div className="absolute right-3 top-16 flex items-center gap-2 rounded-2xl border border-white/70 bg-white px-2.5 py-2 shadow-xl shadow-primary-900/15 sm:right-6 sm:top-12 sm:px-4 sm:py-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-error-50 text-error-700">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs font-bold text-neutral-800">Documents ready</span>
                  <span className="mt-0.5 block text-[10px] text-neutral-500">PDF · Word · Images</span>
                </span>
              </div>
              <div className="absolute inset-x-6 bottom-7 top-[8.5rem] flex items-center justify-center sm:inset-x-10 sm:bottom-9 sm:top-36">
                <div className="relative w-full max-w-[19rem] -rotate-2 rounded-2xl border border-white/80 bg-white p-3 shadow-2xl shadow-primary-900/30 sm:rounded-[1.6rem] sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-800 sm:h-12 sm:w-12">
                      <Printer className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-success-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-success-800 sm:px-3">Ready</span>
                  </div>
                  <p className="mt-3 text-base font-bold tracking-tight text-neutral-900 sm:mt-5 sm:text-lg">Print with confidence</p>
                  <p className="mt-1 text-[11px] leading-4 text-neutral-500 sm:text-xs sm:leading-normal">A clear, simple request from upload to pickup.</p>
                  <div className="mt-4 flex items-center gap-2 sm:mt-5">
                    <span className="h-2 flex-1 rounded-full bg-primary-700" />
                    <span className="h-2 flex-1 rounded-full bg-accent-400" />
                    <span className="h-2 flex-1 rounded-full bg-error-500" />
                    <span className="h-2 flex-1 rounded-full bg-success-500" />
                  </div>
                </div>
              </div>
              <span className="absolute bottom-8 right-7 h-4 w-4 rounded-full bg-accent-300 shadow-[0_0_24px_rgba(244,185,66,0.7)]" />
              <span className="absolute bottom-16 left-7 h-3 w-3 rounded-full bg-error-400 shadow-[0_0_20px_rgba(243,107,121,0.7)]" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-14">
        <div id="track-request" className="grid min-w-0 scroll-mt-24 gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
          <Card className="flex min-w-0 flex-col border-secondary-100/80">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary-100 to-accent-50 text-secondary-700">
              <Search className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-xl font-bold text-neutral-900">Track a print request</h2>
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

          <div className="grid min-w-0 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-1">
            {STEPS.map(({ icon: Icon, title, text }, index) => (
              <Card key={title} className="flex min-w-0 gap-3 p-4 sm:flex-col sm:gap-4 sm:p-5 lg:flex-row">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm ${index === 0 ? 'bg-gradient-to-br from-primary-500 to-primary-700' : index === 1 ? 'bg-gradient-to-br from-secondary-500 to-secondary-700' : 'bg-gradient-to-br from-accent-400 to-accent-600'}`}>
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

        <p className="mt-8 flex items-start justify-center gap-2 text-center text-xs leading-5 font-medium text-neutral-500 sm:mt-10">
          <Printer className="h-3.5 w-3.5" aria-hidden="true" />
          Nothing is printed until an administrator approves your request.
        </p>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-primary-900 px-5 py-6 shadow-xl shadow-primary-900/15 sm:rounded-[2rem] sm:px-9 sm:py-9">
          <div className="pointer-events-none absolute -right-14 -top-24 h-64 w-64 rounded-full bg-yellow-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-red-500/15 blur-3xl" />
          <div className="relative grid min-w-0 items-center gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-300">Simple from start to finish</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">A better way to manage print requests.</h2>
              <p className="mt-2 text-sm leading-6 text-primary-100">
                Upload, choose your options, and follow each request with a single reference number.
              </p>
              <Link to="/print" className="mt-5 inline-flex">
                <Button variant="secondary" size="md">
                  Get started <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: FileUp, title: 'Quick upload', color: 'bg-error-400/20 text-error-200' },
                { icon: ListChecks, title: 'Flexible options', color: 'bg-accent-300/20 text-accent-200' },
                { icon: Clock3, title: 'Easy tracking', color: 'bg-success-400/20 text-success-200' },
              ].map(({ icon: Icon, title, color }) => (
                <div key={title} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 sm:flex-col sm:items-start sm:p-5">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-semibold text-white">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
