/**
 * Custom error class for handling BFF (Backend-For-Frontend) specific errors.
 * This class extends the native Error class and adds support for status codes
 * and error codes typically returned from API responses.
 *
 * @example
 * // Creating a new BFF error
 * const error = new BffError('Resource not found', 404, 'NOT_FOUND');
 *
 * // Extract error from URL parameters
 * const urlError = BffError.fromURL();
 *
 * @class BffError
 * @extends {Error}
 */
export class BffError extends Error {
  code?: string
  statusCode?: number

  constructor(message: string, statusCode?: number, code?: string) {
    super(message)
    this.name = 'BffError'
    this.statusCode = statusCode
    this.code = code

    Object.setPrototypeOf(this, BffError.prototype)
  }

  /**
   * Extracts error information from the URL parameters and returns a new BffError instance.
   */
  static fromURL(): BffError | null {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('bff_error_code') ?? undefined
    const statusCode = urlParams.get('bff_error_status_code')
    const message = urlParams.get('bff_error_message') ?? 'An error occurred'

    if (!statusCode) {
      return null
    }

    return new BffError(message, parseInt(statusCode) || 500, code)
  }
}
