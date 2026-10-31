export default function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-[3px] border-current border-r-transparent motion-reduce:animate-none ${className}`}
    />
  );
}
