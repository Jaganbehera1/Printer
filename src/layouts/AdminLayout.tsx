import { LayoutDashboard, LogOut, Menu, Printer, Settings, X, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { getAuthClient } from '@/firebase/client';
import { signOutAdmin } from '@/services/authService';
import { BRAND_NAME } from '@/utils/constants';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/jobs', label: 'Print Jobs', icon: Printer },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const email = getAuthClient().currentUser?.email ?? '';

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-[4.5rem] items-center gap-3 border-b border-white/10 px-4 sm:px-5">
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-primary-900 ring-1 ring-white/20">
          <img src="/images/jagan-logo.jpg" alt="" className="h-full w-full object-cover" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{BRAND_NAME}</p>
          <p className="text-xs text-neutral-300">Admin console</p>
        </div>
      </div>

      <nav aria-label="Admin navigation" className="flex-1 space-y-1 px-3 py-5">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={closeMenu}
            className={({ isActive }) =>
              `flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent-400 font-semibold text-primary-900 shadow-sm shadow-black/10'
                  : 'text-neutral-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <p className="truncate text-xs text-neutral-300" title={email}>
          {email}
        </p>
        <button
          type="button"
          onClick={() => void signOutAdmin()}
          className="mt-3 flex h-10 w-full items-center gap-2 rounded-xl px-3 text-sm font-medium text-neutral-200 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside
        aria-label="Admin sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-[min(18rem,88vw)] bg-gradient-to-b from-primary-900 to-primary-800 shadow-2xl shadow-primary-900/20 transition-transform duration-200 ease-out motion-reduce:transition-none lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:translate-x-0 lg:shadow-none ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebar}
      </aside>

      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMenu}
          className="fixed inset-0 z-30 bg-primary-900/50 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-[4.5rem] items-center justify-between border-b border-neutral-200 bg-white/95 px-4 backdrop-blur lg:hidden">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-primary-900">
              <img src="/images/jagan-logo.jpg" alt="" className="h-full w-full object-cover" />
            </span>
            <p className="truncate text-sm font-bold text-primary-900">Admin console</p>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        <main className="page-enter min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
