import { HttpException } from '@nestjs/common'

/**
 * GraphQL error title for a fylgiskjal DMR refused. The UI shows the problem's
 * `detail` (DMR's own localized reason) only under this title, so a refusal
 * like "macros found" reaches the applicant while other failures stay generic.
 * The equality-report template keeps its own copy of this string.
 */
export const EQUALITY_ATTACHMENT_REJECTED = 'DoeEqualityAttachmentRejected'

// Kept here rather than read off the generated client enum so this module
// stays free of client imports and can be unit-tested on its own.
const ATTACHMENT_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'xls'] as const

export type AttachmentExtension = typeof ATTACHMENT_EXTENSIONS[number]

/**
 * DMR's own rule: case and a leading dot are ignored. Undefined for anything
 * DMR would refuse, including macro-enabled .xlsm/.docm.
 */
export const normaliseAttachmentExtension = (
  extension: string,
): AttachmentExtension | undefined => {
  const normalised = extension.trim().replace(/^\./, '').toLowerCase()
  return (ATTACHMENT_EXTENSIONS as readonly string[]).includes(normalised)
    ? (normalised as AttachmentExtension)
    : undefined
}

/**
 * Turns DMR's 4xx answer to an attachment call into the error the UI reads.
 *
 * DMR refuses with a curated, localized reason in `translatedMessage`
 * (unsupported type, macros found, contents don't match the extension, report
 * no longer editable, six already attached). Undefined for anything that isn't
 * a 4xx, which the caller rethrows unchanged.
 */
export const toAttachmentRejection = (
  status: number,
  body: unknown,
): HttpException | undefined => {
  if (status < 400 || status >= 500) return undefined
  const translatedMessage = (body as { translatedMessage?: unknown } | null)
    ?.translatedMessage
  const reason =
    typeof translatedMessage === 'string' && translatedMessage.trim().length > 0
      ? translatedMessage
      : ''
  return new HttpException(
    { error: EQUALITY_ATTACHMENT_REJECTED, message: reason },
    status,
  )
}
