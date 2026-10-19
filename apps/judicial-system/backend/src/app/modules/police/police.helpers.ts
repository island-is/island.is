import { PayloadTooLargeException } from '@nestjs/common'

/**
 * True when an upload failed because LÖKE rejected the file as too large.
 * Such an upload will never succeed, so deliveries are completed without
 * retrying - the prosecutor has been notified by email and is expected to
 * upload the file by hand.
 */
export const isFileTooLargeForPolice = (reason: unknown): boolean =>
  reason instanceof PayloadTooLargeException
