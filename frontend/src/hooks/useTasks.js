import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/index.js';

export const TASKS_KEY = 'tasks';

/**
 * Fetch a paginated + filtered task list.
 * Re-fetches automatically when filters change.
 *
 * @param {object} filters - { page, limit, status, priority }
 */
export function useTasks(filters = {}) {
  return useQuery({
    queryKey: [TASKS_KEY, filters],
    queryFn:  () => tasksApi.list(filters).then((res) => res.data),
    staleTime: 30_000,
    placeholderData: (prev) => prev, // keeps previous data while fetching
  });
}

/** Create a task and invalidate the list cache. */
export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => tasksApi.create(data).then((res) => res.data.task),
    onSuccess: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}

/** Update a task and invalidate the list cache. */
export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => tasksApi.update(id, data).then((res) => res.data.task),
    onSuccess: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}

/** Soft-delete a task and invalidate the list cache. */
export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => tasksApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}
