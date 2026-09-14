import { PayloadTooLargeException } from '@nestjs/common'

/**
 * True when an upload failed because the court service rejected the file as
 * too large. Such an upload will never succeed, so deliveries are completed
 * without retrying - the court has been notified by email and is expected to
 * upload the file by hand.
 */
export const isFileTooLargeForCourt = (reason: unknown): boolean =>
  reason instanceof PayloadTooLargeException
