import { PayloadTooLargeException } from '@nestjs/common'

/**
 * True when an upload failed because LÖKE rejected the file as too large
 * and the prosecutor was notified by email. Such an upload will never
 * succeed, so deliveries are completed without retrying - the prosecutor
 * is expected to upload the file by hand. If notification failed, callers
 * should not treat the error as this type and delivery should be retried.
 */
export const isFileTooLargeForPolice = (reason: unknown): boolean =>
  reason instanceof PayloadTooLargeException
