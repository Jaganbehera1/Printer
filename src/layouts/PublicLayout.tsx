import { ArrowRight, ExternalLink, Menu, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { BRAND_NAME, BRAND_WEBSITE } from '@/utils/constants';

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <header className="sticky top-0 z-30 border-b border-neutral-200/80 bg-white/95 shadow-[0_8px_24px_-20px_rgba(11,31,58,0.35)] backdrop-blur-xl">
        <div className="relative mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-4 sm:h-[5rem] sm:px-6 lg:px-8">
          <Link to="/" aria-label={`${BRAND_NAME} home`} className="flex min-w-0 items-center gap-2.5 sm:gap-3" onClick={closeMenu}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-900 shadow-md shadow-primary-900/15 ring-1 ring-neutral-200">
              <img src="/images/jagan-logo.jpg" alt="" className="h-full w-full object-cover" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold leading-tight tracking-tight text-neutral-900 sm:text-base">
                Jagan <span className="text-primary-700">Web</span> Solutions
              </span>
              <span className="mt-1 hidden items-center gap-1 text-[10px] font-medium text-neutral-500 sm:flex">
                jaganwebsolutions.netlify.app
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </span>
            </span>
          </Link>
          <nav aria-label="Main navigation" className="hidden shrink-0 items-center gap-2 sm:flex lg:gap-3">
            <Link
              to="/#track-request"
              className="inline-flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-primary-50 hover:text-primary-800"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Track request
            </Link>
            <Link
              to="/print"
              className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-primary-700 to-primary-900 px-4 text-sm font-semibold text-white shadow-md shadow-primary-800/20 transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
              New print job
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </nav>
          <div className="flex items-center gap-2 sm:hidden">
            <Link
              to="/print"
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary-800 px-3 text-xs font-semibold text-white shadow-sm"
              onClick={closeMenu}
            >
              Print <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-100"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div
          id="mobile-navigation"
          className={`grid overflow-hidden border-t border-neutral-100 bg-white transition-[grid-template-rows,opacity] duration-200 sm:hidden ${
            menuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] border-transparent opacity-0'
          }`}
          aria-hidden={!menuOpen}
        >
          <nav className="min-h-0 overflow-hidden px-4">
            <Link
              to="/#track-request"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
              className="flex min-h-12 items-center gap-3 border-b border-neutral-100 text-sm font-semibold text-neutral-700"
            >
              <Search className="h-4 w-4 text-primary-700" aria-hidden="true" />
              Track a request
            </Link>
            <a
              href={BRAND_WEBSITE}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
              className="flex min-h-12 items-center gap-3 text-sm font-semibold text-neutral-700"
            >
              <ExternalLink className="h-4 w-4 text-accent-700" aria-hidden="true" />
              Visit Jagan Web Solutions
            </a>
          </nav>
        </div>
        <div className="brand-stripe absolute inset-x-0 bottom-0 h-1" aria-hidden="true" />
      </header>

      <main className="page-enter flex-1">
        <Outlet />
      </main>

      <footer className="mt-10 border-t border-neutral-200/80 bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs font-medium text-neutral-500 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
            <div className="flex items-center gap-3">
              <img src="/images/jagan-logo.jpg" alt="" className="h-9 w-9 rounded-xl object-cover" />
              <span>{BRAND_NAME}</span>
            </div>
            <a href={BRAND_WEBSITE} target="_blank" rel="noreferrer" className="transition-colors hover:text-primary-700">
              jaganwebsolutions.netlify.app
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
