export function generateJobId(now: Date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const randomPart = crypto.getRandomValues(new Uint32Array(1))[0] % 10000;
  return `PR-${datePart}-${String(randomPart).padStart(4, '0')}`;
}

export const JOB_ID_PATTERN = /^PR-\d{8}-\d{4}$/;
