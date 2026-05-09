import { ForbiddenError } from './errors.js';

/**
 * Asserts that the requesting user owns the resource, or is an admin.
 *
 * Call this from a service or controller once you have loaded the resource.
 * Throws ForbiddenError so the global error handler returns a 403.
 *
 * @param {object} options
 * @param {string} options.requesterId  - ID of the authenticated user (req.user.userId)
 * @param {string} options.requesterRole - Role of the authenticated user (req.user.role)
 * @param {string} options.ownerId      - ID stored on the resource (e.g. task.user_id)
 *
 * @throws {ForbiddenError} when the requester is neither the owner nor an admin.
 *
 * @example
 * // In a task service:
 * assertOwnership({
 *   requesterId:   req.user.userId,
 *   requesterRole: req.user.role,
 *   ownerId:       task.user_id,
 * });
 */
export const assertOwnership = ({ requesterId, requesterRole, ownerId }) => {
  const isOwner = requesterId === ownerId;
  const isAdmin = requesterRole === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ForbiddenError('You do not have permission to access this resource');
  }
};

/**
 * Pure boolean ownership check — use when you need the result
 * without throwing (e.g. to conditionally shape a response).
 *
 * @param {object} options
 * @param {string} options.requesterId
 * @param {string} options.requesterRole
 * @param {string} options.ownerId
 * @returns {boolean}
 */
export const canAccess = ({ requesterId, requesterRole, ownerId }) => {
  return requesterId === ownerId || requesterRole === 'admin';
};
