import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../hooks/useTasks.js';
import { Navbar } from '../components/Navbar.jsx';
import { CreateTaskForm } from '../components/CreateTaskForm.jsx';
import { TaskCard } from '../components/TaskCard.jsx';
import { SelectField } from '../components/FormField.jsx';

const STATUSES   = ['', 'pending', 'in_progress', 'completed', 'archived'];
const PRIORITIES = ['', 'low', 'medium', 'high'];

const STATUS_LABELS = {
  pending: 'Pending', in_progress: 'In Progress', completed: 'Completed', archived: 'Archived',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ page: 1, limit: 20, status: '', priority: '' });

  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== ''),
  );

  const { data, isLoading, isError, error, isFetching } = useTasks(activeFilters);
  const tasks      = data?.tasks      ?? [];
  const pagination = data?.pagination ?? null;

  const setFilter = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value, page: 1 }));

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0e0e10' }}>
      <Navbar />

      <main className="mx-auto max-w-3xl px-5 py-8">

        {/* Page header */}
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-[#e2e2e8] tracking-tight">
              {user?.role === 'admin' ? 'All Tasks' : 'My Tasks'}
            </h1>
            <p className="mt-0.5 text-sm text-[#50506a]">
              {isLoading ? 'Loading…' : (
                <>
                  {pagination?.total ?? 0} {pagination?.total === 1 ? 'task' : 'tasks'}
                  {isFetching && !isLoading && (
                    <span className="ml-2 text-violet-500">· Syncing</span>
                  )}
                </>
              )}
            </p>
          </div>
          <CreateTaskForm />
        </div>

        {/* Filter bar */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[#50506a] mr-1">Filter</span>
          <SelectField
            id="filter-status"
            value={filters.status}
            onChange={setFilter('status')}
            className="w-36"
          >
            <option value="">All statuses</option>
            {STATUSES.filter(Boolean).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </SelectField>

          <SelectField
            id="filter-priority"
            value={filters.priority}
            onChange={setFilter('priority')}
            className="w-32"
          >
            <option value="">All priorities</option>
            {PRIORITIES.filter(Boolean).map((p) => (
              <option key={p} value={p} className="capitalize">{p}</option>
            ))}
          </SelectField>

          {/* Clear filters */}
          {(filters.status || filters.priority) && (
            <button
              onClick={() => setFilters((f) => ({ ...f, status: '', priority: '', page: 1 }))}
              className="text-xs text-[#50506a] hover:text-[#9090a0] transition-colors underline underline-offset-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-2.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl border border-[#1a1a22]"
                style={{ backgroundColor: '#11111700', backgroundImage: 'linear-gradient(90deg, #13131a 0%, #1a1a24 50%, #13131a 100%)', backgroundSize: '200% 100%', animation: 'pulse 1.5s ease-in-out infinite' }}
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-6 text-center">
            <p className="font-medium text-rose-400">Failed to load tasks</p>
            <p className="mt-1 text-sm text-rose-500/70">
              {error?.response?.data?.message ?? error?.message ?? 'An unexpected error occurred'}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#1e1e28] py-16 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#2a2a35] bg-[#13131a]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-[#50506a]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="font-medium text-[#6060780]" style={{ color: '#9090a0' }}>No tasks</p>
            <p className="mt-1 text-sm text-[#50506a]">
              {Object.values(activeFilters).some(Boolean)
                ? 'No tasks match the current filters.'
                : 'Click "New Task" to get started.'}
            </p>
          </div>
        )}

        {/* Task list */}
        {!isLoading && !isError && tasks.length > 0 && (
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-[#1a1a22] pt-5">
            <button
              onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
              disabled={!pagination.hasPrevPage}
              className="rounded-lg border border-[#2a2a35] bg-[#13131a] px-4 py-2 text-sm font-medium text-[#9090a0] hover:bg-[#1a1a22] hover:text-[#c8c8d4] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>
            <span className="text-xs text-[#50506a]">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
              disabled={!pagination.hasNextPage}
              className="rounded-lg border border-[#2a2a35] bg-[#13131a] px-4 py-2 text-sm font-medium text-[#9090a0] hover:bg-[#1a1a22] hover:text-[#c8c8d4] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
