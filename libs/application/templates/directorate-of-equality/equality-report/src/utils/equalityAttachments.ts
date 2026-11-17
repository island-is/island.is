// Fylgiskjöl limits, mirrored from DMR so the applicant hears about a bad file
// before anything is uploaded. DMR checks every one of these again.
export const MAX_ATTACHMENTS = 6
export const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024
export const MAX_ATTACHMENT_FILENAME_LENGTH = 255

export const ATTACHMENT_CONTENT_TYPES = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
} as const

export type AttachmentExtension = keyof typeof ATTACHMENT_CONTENT_TYPES

export const ATTACHMENT_ACCEPT = Object.keys(ATTACHMENT_CONTENT_TYPES).map(
  (extension) => `.${extension}`,
)

/**
 * GraphQL problem title the API uses for a fylgiskjal DMR refused. Must match
 * EQUALITY_ATTACHMENT_REJECTED in the directorate-of-equality-application
 * domain, which a template cannot import.
 */
export const EQUALITY_ATTACHMENT_REJECTED = 'DoeEqualityAttachmentRejected'

export const getAttachmentExtension = (
  filename: string,
): AttachmentExtension | undefined => {
  const dot = filename.lastIndexOf('.')
  if (dot < 0) return undefined
  const extension = filename.slice(dot + 1).toLowerCase()
  // Own keys only: `in` would let `x.constructor` through.
  return Object.prototype.hasOwnProperty.call(
    ATTACHMENT_CONTENT_TYPES,
    extension,
  )
    ? (extension as AttachmentExtension)
    : undefined
}

export type AttachmentRejection =
  | 'unsupportedType'
  | 'tooLarge'
  | 'empty'
  | 'filenameTooLong'

/**
 * The checks DMR would refuse a file for that can be made without reading it.
 * Macros and contents that don't match the extension are DMR's to find.
 */
export const validateAttachment = (
  file: Pick<File, 'name' | 'size'>,
): AttachmentRejection | undefined => {
  if (!getAttachmentExtension(file.name)) return 'unsupportedType'
  if (file.name.length > MAX_ATTACHMENT_FILENAME_LENGTH) {
    return 'filenameTooLong'
  }
  if (file.size === 0) return 'empty'
  if (file.size > MAX_ATTACHMENT_BYTES) return 'tooLarge'
  return undefined
}

/**
 * DMR's reason for refusing a fylgiskjal, when the API passed one on.
 *
 * `rejected` is true for any refusal DMR made (bad type, macros, mismatched
 * contents, report no longer editable, limit reached), so the caller can say
 * "not accepted" rather than "something went wrong" even without a reason.
 */
export const getAttachmentRejection = (
  error: unknown,
): { rejected: boolean; reason?: string } => {
  const graphQLErrors = (
    error as {
      graphQLErrors?: ReadonlyArray<{
        extensions?: { problem?: { title?: unknown; detail?: unknown } }
      }>
    }
  )?.graphQLErrors
  const problem = graphQLErrors?.[0]?.extensions?.problem
  if (problem?.title !== EQUALITY_ATTACHMENT_REJECTED) {
    return { rejected: false }
  }
  const reason =
    typeof problem.detail === 'string' && problem.detail.trim().length > 0
      ? problem.detail
      : undefined
  return { rejected: true, reason }
}
