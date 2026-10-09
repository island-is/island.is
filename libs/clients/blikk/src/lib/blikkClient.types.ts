/**
 * Transport-level error thrown by the Blikk client for any non-2xx response.
 *  For a non-2xx the message includes Blikk's Problem Details `detail` when present.
 */
export class BlikkClientError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'BlikkClientError'
    this.status = status
  }
}
