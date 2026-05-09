import { useState } from 'react';
import { useCreateTask } from '../hooks/useTasks.js';
import { Button } from './Button.jsx';
import { InputField, TextareaField, SelectField } from './FormField.jsx';

/** Collapsible create-task form — dark theme */
export function CreateTaskForm({ onSuccess }) {
  const [open, setOpen]   = useState(false);
  const [error, setError] = useState('');
  const [form, setForm]   = useState({
    title: '', description: '', status: 'pending', priority: 'medium', due_date: '',
  });

  const createTask = useCreateTask();
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      title: form.title.trim(),
      ...(form.description.trim() && { description: form.description.trim() }),
      status:   form.status,
      priority: form.priority,
      ...(form.due_date && { due_date: form.due_date }),
    };
    try {
      await createTask.mutateAsync(payload);
      setForm({ title: '', description: '', status: 'pending', priority: 'medium', due_date: '' });
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to create task');
    }
  };

  if (!open) {
    return (
      <Button variant="primary" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 010 1.5H8.5v4.25a.75.75 0 01-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z" />
        </svg>
        New Task
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-[#252530] bg-[#13131a] p-5 space-y-4 shadow-xl shadow-black/30"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#dcdce8]">New task</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[#50506a] hover:text-[#9090a0] transition-colors"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
            <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
          </svg>
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-sm text-rose-400">
          {error}
        </p>
      )}

      <InputField
        id="new-title"
        label="Title"
        placeholder="What needs to be done?"
        value={form.title}
        onChange={set('title')}
        required
        autoFocus
      />

      <TextareaField
        id="new-desc"
        label="Description"
        placeholder="Optional details…"
        value={form.description}
        onChange={set('description')}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SelectField id="new-status" label="Status" value={form.status} onChange={set('status')}>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </SelectField>

        <SelectField id="new-priority" label="Priority" value={form.priority} onChange={set('priority')}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </SelectField>

        <InputField
          id="new-due"
          label="Due date"
          type="date"
          value={form.due_date}
          onChange={set('due_date')}
          className="col-span-2 sm:col-span-1"
        />
      </div>

      <div className="flex gap-2 justify-end border-t border-[#1e1e28] pt-4">
        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={createTask.isPending}>
          Create Task
        </Button>
      </div>
    </form>
  );
}
