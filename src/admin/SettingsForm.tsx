import { useState, type FormEvent } from 'react';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FormField, { TextInput } from '@/components/ui/FormField';
import SegmentedControl from '@/components/ui/SegmentedControl';
import { saveSettings } from '@/services/settingsService';
import type { PrintSettings } from '@/types/printSettings';
import { HARD_MAX_FILE_MB } from '@/utils/constants';
import { getUserErrorMessage } from '@/utils/errors';
import { DUPLEX_LABELS, PRINT_MODE_LABELS } from '@/utils/format';

interface SettingsFormProps {
  initial: PrintSettings;
}

type Errors = Partial<Record<'schoolName' | 'maxFileSize' | 'maxCopies', string>>;

function validate(draft: PrintSettings): Errors {
  const errors: Errors = {};
  const name = draft.schoolName.trim();
  if (name.length < 2 || name.length > 80) errors.schoolName = 'Name must be between 2 and 80 characters.';
  if (!Number.isInteger(draft.maxFileSize) || draft.maxFileSize < 1 || draft.maxFileSize > HARD_MAX_FILE_MB) {
    errors.maxFileSize = `Enter a whole number of MB from 1 to ${HARD_MAX_FILE_MB}.`;
  }
  if (!Number.isInteger(draft.maxCopies) || draft.maxCopies < 1 || draft.maxCopies > 100) {
    errors.maxCopies = 'Enter a whole number of copies from 1 to 100.';
  }
  return errors;
}

export default function SettingsForm({ initial }: SettingsFormProps) {
  const [draft, setDraft] = useState<PrintSettings>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  const update = (patch: Partial<PrintSettings>) => setDraft((previous) => ({ ...previous, ...patch }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(draft);
    setErrors(nextErrors);
    setMessage(null);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      await saveSettings({ ...draft, schoolName: draft.schoolName.trim() });
      setMessage({ tone: 'success', text: 'Settings saved. Users will see the new options right away.' });
    } catch (error) {
      setMessage({ tone: 'error', text: getUserErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className="space-y-7">
        <div className="space-y-5">
          <h2 className="text-base font-bold text-primary-900">Service details</h2>
          <FormField label="Service name" htmlFor="schoolName" error={errors.schoolName}>
            <TextInput
              id="schoolName"
              value={draft.schoolName}
              invalid={!!errors.schoolName}
              onChange={(event) => update({ schoolName: event.target.value })}
            />
          </FormField>
        </div>

        <div className="space-y-5 border-t border-neutral-200 pt-6">
          <h2 className="text-base font-bold text-primary-900">Upload and copy limits</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Maximum file size (MB)" htmlFor="maxFileSize" error={errors.maxFileSize}>
              <TextInput
                id="maxFileSize"
                type="number"
                inputMode="numeric"
                min={1}
                max={HARD_MAX_FILE_MB}
                value={draft.maxFileSize}
                invalid={!!errors.maxFileSize}
                onChange={(event) => update({ maxFileSize: Number(event.target.value) })}
              />
            </FormField>
            <FormField label="Maximum copies" htmlFor="maxCopies" error={errors.maxCopies}>
              <TextInput
                id="maxCopies"
                type="number"
                inputMode="numeric"
                min={1}
                max={100}
                value={draft.maxCopies}
                invalid={!!errors.maxCopies}
                onChange={(event) => update({ maxCopies: Number(event.target.value) })}
              />
            </FormField>
          </div>
          <p className="text-sm text-neutral-500">
            Accepted: PDF, Word, Excel, PowerPoint, text and image files.
          </p>
        </div>

        <div className="space-y-5 border-t border-neutral-200 pt-6">
          <h2 className="text-base font-bold text-primary-900">Approval and defaults</h2>
          <div className="flex items-center justify-between gap-4 rounded-xl bg-neutral-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-neutral-900">Require admin approval</p>
              <p className="text-xs text-neutral-500">
                When on, every request waits for your approval before printing.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={draft.printApprovalRequired}
              aria-label="Require admin approval"
              onClick={() => update({ printApprovalRequired: !draft.printApprovalRequired })}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                draft.printApprovalRequired ? 'bg-success-600' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  draft.printApprovalRequired ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-neutral-800">Default colour mode</p>
            <SegmentedControl
              name="defaultPrintMode"
              value={draft.defaultPrintMode}
              onChange={(defaultPrintMode) => update({ defaultPrintMode })}
              options={Object.entries(PRINT_MODE_LABELS).map(([value, label]) => ({
                value: value as PrintSettings['defaultPrintMode'],
                label,
              }))}
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-neutral-800">Default sides</p>
            <SegmentedControl
              name="defaultDuplex"
              value={draft.defaultDuplex}
              onChange={(defaultDuplex) => update({ defaultDuplex })}
              options={Object.entries(DUPLEX_LABELS).map(([value, label]) => ({
                value: value as PrintSettings['defaultDuplex'],
                label,
              }))}
            />
          </div>
        </div>

        {message && <Alert tone={message.tone === 'success' ? 'success' : 'error'}>{message.text}</Alert>}

        <div className="flex justify-end border-t border-neutral-200 pt-6">
          <Button type="submit" size="lg" loading={saving} className="w-full sm:w-auto">
            Save settings
          </Button>
        </div>
      </form>
    </Card>
  );
}
