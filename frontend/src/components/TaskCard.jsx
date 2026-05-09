import { useState } from 'react';
import { useUpdateTask, useDeleteTask } from '../hooks/useTasks.js';
import { StatusBadge, PriorityBadge } from './Badge.jsx';
import { Button } from './Button.jsx';
import { SelectField } from './FormField.jsx';

/** Single task card — dark reference design */
export function TaskCard({ task }) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus]   = useState(task.status);
  const [error, setError]     = useState('');

  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleStatusSave = async () => {
    setError('');
    try {
      await updateTask.mutateAsync({ id: task.id, data: { status } });
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Update failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    setError('');
    try {
      await deleteTask.mutateAsync(task.id);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Delete failed');
    }
  };

  return (
    <div className="group relative rounded-xl border border-[#1e1e28] bg-[#13131a] p-4 transition-all duration-200 hover:border-[#2a2a36] hover:bg-[#16161e]">
      {/* Subtle left accent bar */}
      <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-violet-600/40 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-4">
        {/* Left content */}
        <div className="min-w-0 flex-1 space-y-2.5">
          <p className="truncate font-medium text-[#dcdce8] leading-snug">{task.title}</p>

          {task.description && (
            <p className="line-clamp-2 text-sm text-[#6060780] leading-relaxed" style={{color:'#60607a'}}>
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {editing ? (
              <SelectField
                id={`status-${task.id}`}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-36"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </SelectField>
            ) : (
              <StatusBadge status={task.status} />
            )}

            <PriorityBadge priority={task.priority} />

            {task.due_date && (
              <span className="flex items-center gap-1 text-xs text-[#50506a]">
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                  <path d="M5.75 7.25a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" />
                  <path fillRule="evenodd" d="M4.75 1a.75.75 0 01.75.75V3h5V1.75a.75.75 0 011.5 0V3h1.25A1.75 1.75 0 0115 4.75v8.5A1.75 1.75 0 0113.25 15H2.75A1.75 1.75 0 011 13.25v-8.5C1 3.783 1.783 3 2.75 3H4V1.75A.75.75 0 014.75 1zm-2 4.5v7.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V5.5H2.75z" clipRule="evenodd" />
                </svg>
                {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>

          {error && <p className="text-xs text-rose-400">{error}</p>}
        </div>

        {/* Actions — visible on hover */}
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          {editing ? (
            <>
              <Button size="sm" variant="primary" loading={updateTask.isPending} onClick={handleStatusSave}>
                Save
              </Button>
              <Button size="sm" variant="secondary" onClick={() => { setEditing(false); setStatus(task.status); }}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={() => setEditing(true)} title="Edit status">
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61z" />
                </svg>
              </Button>
              <Button size="sm" variant="danger" loading={deleteTask.isPending} onClick={handleDelete} title="Delete">
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zm4.5 0V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675l.66 6.6a.25.25 0 00.249.225h5.19a.25.25 0 00.249-.225l.66-6.6a.75.75 0 011.492.149l-.66 6.6A1.748 1.748 0 0111.595 15h-5.19a1.75 1.75 0 01-1.741-1.576l-.66-6.6a.75.75 0 111.492-.149z" />
                </svg>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
