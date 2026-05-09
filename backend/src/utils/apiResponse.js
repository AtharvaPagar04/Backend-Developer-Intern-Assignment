/**
 * Wraps a value in a standardised success response shape.
 * @param {*} data
 * @param {string} [message]
 * @returns {{ success: true, message: string, data: * }}
 */
export const successResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data,
});

/**
 * Wraps an error in a standardised error response shape.
 * @param {string} message
 * @param {*} [errors]
 * @returns {{ success: false, message: string, errors: * }}
 */
export const errorResponse = (message = 'Something went wrong', errors = null) => ({
  success: false,
  message,
  ...(errors && { errors }),
});
