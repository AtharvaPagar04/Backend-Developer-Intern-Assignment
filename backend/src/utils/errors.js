/**
 * Application-level base error class.
 * Throw this (or a subclass) from any layer; the global
 * error handler will serialise it into the correct HTTP response.
 */
export class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   * @param {*}      [errors]   - optional Zod / validation error details
   */
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', errors = null) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}
