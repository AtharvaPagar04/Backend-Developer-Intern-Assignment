import { useAuth } from '../context/AuthContext.jsx';
import { Button } from './Button.jsx';

/** Top navigation bar — dark theme with GitHub + Portfolio links */
export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-[#1e1e25] bg-[#0e0e10]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">

        {/* ── Left: Logo + nav links ── */}
        <div className="flex items-center gap-5">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 shadow-md shadow-violet-900/50">
              <svg viewBox="0 0 20 20" fill="white" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-semibold text-[#e2e2e8] tracking-tight">TaskFlow</span>
          </div>

          {/* Divider */}
          <div className="hidden h-4 w-px bg-[#2a2a35] sm:block" />

          {/* GitHub link */}
          <a
            href="https://github.com/AtharvaPagar04/Backend-Developer-Intern-Assignment"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-md border border-[#2a2a35] bg-[#13131a] px-2.5 py-1 text-xs font-medium text-[#c8c8d4] transition-all hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-300"
          >
            {/* GitHub icon */}
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span className="hidden md:inline">Source</span>
          </a>

          {/* Portfolio link */}
          <a
            href="https://portfolio-kappa-nine-4tzfdgmj5g.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-md border border-violet-500/40 bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-400 transition-all hover:border-violet-400/60 hover:bg-violet-500/20 hover:text-violet-300"
          >
            {/* Globe / portfolio icon */}
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
              <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zm5-4.5a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3zm-.75 3a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
            </svg>
            <span className="hidden md:inline">Portfolio</span>
          </a>
        </div>

        {/* ── Right: API Docs + user + sign out ── */}
        <div className="flex items-center gap-3">

          {/* API Docs */}
          <a
            href="/api-docs"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1 text-xs font-medium text-[#6060780] transition-colors hover:text-[#9090a0]"
            style={{ color: '#606078' }}
          >
            API Docs
            <svg viewBox="0 0 12 12" fill="currentColor" className="h-2.5 w-2.5 opacity-60">
              <path d="M3.5 1a.5.5 0 000 1H8.293L1.146 9.146a.5.5 0 00.708.708L9 2.707V7.5a.5.5 0 001 0v-6a.5.5 0 00-.5-.5h-6z" />
            </svg>
          </a>

          {/* Separator */}
          <div className="hidden h-4 w-px bg-[#2a2a35] sm:block" />

          {user && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600/20 border border-violet-500/30 text-xs font-semibold text-violet-400">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-[#9090a0]">{user.name}</span>
              {user.role === 'admin' && (
                <span className="rounded-md bg-violet-500/15 px-1.5 py-0.5 text-xs font-medium text-violet-400 ring-1 ring-violet-500/30">
                  admin
                </span>
              )}
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
