enum BffErrorCodes {
  code = 'bff_error_code',
  statusCode = 'bff_error_status_code',
  message = 'bff_error_message',
}

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
    const code = urlParams.get(BffErrorCodes.code) ?? undefined
    const statusCode = urlParams.get(BffErrorCodes.statusCode)
    const message = urlParams.get(BffErrorCodes.message) ?? 'An error occurred'

    if (!statusCode) {
      return null
    }

    return new BffError(message, parseInt(statusCode) || 500, code)
  }

  /**
   * Removes BFF error parameters from the current URL.
   */
  static removeBffErrorParamsFromURL() {
    const url = new URL(window.location.href)

    // Only removes bff error params
    url.searchParams.delete(BffErrorCodes.code)
    url.searchParams.delete(BffErrorCodes.statusCode)
    url.searchParams.delete(BffErrorCodes.message)

    // Replace the current URL without error parameters and affecting the browser history.
    window.history.replaceState({}, '', url.toString())

    return url.toString()
  }
}
