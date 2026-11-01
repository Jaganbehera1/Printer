import { Minus, Plus } from 'lucide-react';
import FormField, { TextInput } from '@/components/ui/FormField';
import SegmentedControl from '@/components/ui/SegmentedControl';
import type { PrintFormErrors, PrintFormValues } from '@/utils/validation';

interface PrintOptionsFieldsProps {
  values: PrintFormValues;
  errors: PrintFormErrors;
  maxCopies: number;
  currentPage: number;
  hasPdfPreview: boolean;
  onChange: (patch: Partial<PrintFormValues>) => void;
}

const stepButton =
  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-primary-700 shadow-sm transition-all hover:border-primary-300 hover:bg-primary-50 active:scale-95 disabled:opacity-40';

export default function PrintOptionsFields({ values, errors, maxCopies, currentPage, hasPdfPreview, onChange }: PrintOptionsFieldsProps) {
  const copies = Number(values.copies) || 1;

  const setCopies = (next: number) => {
    onChange({ copies: String(Math.min(maxCopies, Math.max(1, next))) });
  };

  return (
    <div className="space-y-6">
      <FormField label="Number of copies" htmlFor="copies" error={errors.copies} hint={`Up to ${maxCopies} copies`}>
        <div className="flex items-center gap-3">
          <button type="button" className={stepButton} onClick={() => setCopies(copies - 1)} disabled={copies <= 1} aria-label="Fewer copies">
            <Minus className="h-5 w-5" />
          </button>
          <TextInput
            id="copies"
            type="number"
            inputMode="numeric"
            min={1}
            max={maxCopies}
            value={values.copies}
            invalid={!!errors.copies}
            onChange={(event) => onChange({ copies: event.target.value })}
            className="text-center text-lg font-semibold"
          />
          <button type="button" className={stepButton} onClick={() => setCopies(copies + 1)} disabled={copies >= maxCopies} aria-label="More copies">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </FormField>

      <div className="space-y-3">
        <p className="text-sm font-medium text-neutral-800">Pages to print</p>
        <SegmentedControl
          name="pageMode"
          value={values.pageMode}
          onChange={(pageMode) => onChange({ pageMode })}
          options={[
            { value: 'ALL', label: 'All pages' },
            { value: 'CURRENT', label: 'Current page', description: hasPdfPreview ? `Page ${currentPage}` : 'Available for PDF files', disabled: !hasPdfPreview },
            { value: 'CUSTOM', label: 'Custom range', description: 'For example 1-5, 7' },
          ]}
        />
        {values.pageMode === 'CUSTOM' && (
          <FormField
            label="Page range"
            htmlFor="pageRange"
            error={errors.pageRange}
            hint="Use commas and dashes, for example 1-5, 2,4,6 or 1-3,7,9"
          >
            <TextInput
              id="pageRange"
              type="text"
              inputMode="text"
              autoComplete="off"
              placeholder="e.g. 1-5, 7, 9"
              value={values.pageRange}
              invalid={!!errors.pageRange}
              onChange={(event) => onChange({ pageRange: event.target.value })}
            />
          </FormField>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-neutral-800">Print colour</p>
        <SegmentedControl
          name="printMode"
          value={values.printMode}
          onChange={(printMode) => onChange({ printMode })}
          options={[
            { value: 'BLACK_WHITE', label: 'Black & White', description: 'Cheaper and faster' },
            { value: 'COLOUR', label: 'Colour', description: 'Full colour pages' },
          ]}
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-neutral-800">Page orientation</p>
        <SegmentedControl
          name="orientation"
          value={values.orientation}
          onChange={(orientation) => onChange({ orientation })}
          options={[
            { value: 'PORTRAIT', label: 'Portrait', description: 'Vertical page' },
            { value: 'LANDSCAPE', label: 'Landscape', description: 'Horizontal page' },
          ]}
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-neutral-800">Sides</p>
        <SegmentedControl
          name="duplex"
          value={values.duplex}
          onChange={(duplex) => onChange({ duplex })}
          options={[
            { value: 'SINGLE', label: 'Single-sided', description: 'One page per sheet' },
            { value: 'DOUBLE', label: 'Double-sided', description: 'Print on both sides' },
          ]}
        />
      </div>
    </div>
  );
}
