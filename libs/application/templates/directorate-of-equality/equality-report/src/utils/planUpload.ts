import mammoth from 'mammoth'

/**
 * A Word or .txt plan travels as HTML inside a GraphQL request, and the
 * island.is API refuses any JSON body over 350kb (`jsonBodyLimit` in
 * apps/api/src/main.ts, 358,400 bytes) with a 413 before our resolver runs.
 * This keeps the base64 HTML under it with room for the rest of the request.
 * A PDF doesn't travel this way; it goes to S3 by presigned URL.
 */
export const MAX_INLINE_BASE64_LENGTH = 340 * 1024

/**
 * DMR's cap on a plan PDF, checked again when the key is registered. Same as
 * fylgiskjöl.
 */
export const MAX_PLAN_PDF_BYTES = 4 * 1024 * 1024

/**
 * GraphQL problem title the API uses for a plan PDF DMR refused on the
 * presigned path. Must match EQUALITY_PLAN_REJECTED in the
 * directorate-of-equality-application domain, which a template cannot import.
 */
export const EQUALITY_PLAN_REJECTED = 'DoeEqualityPlanRejected'

/** True when DMR refused the plan PDF itself (not a PDF, empty, too large). */
export const isPlanRejection = (error: unknown): boolean => {
  const graphQLErrors = (
    error as {
      graphQLErrors?: ReadonlyArray<{
        extensions?: { problem?: { title?: unknown } }
      }>
    }
  )?.graphQLErrors
  return (
    graphQLErrors?.[0]?.extensions?.problem?.title === EQUALITY_PLAN_REJECTED
  )
}

/**
 * Converts a .docx to HTML for the admin's read-only view, without images.
 *
 * mammoth embeds every image as a base64 data URI by default, which can push a
 * short plan past the request cap, and the API's sanitize-html allowlist drops
 * `<img>` anyway, so DMR has never received them. Leaving them out changes
 * nothing that reaches DMR. The count lets the screen tell the applicant their
 * images won't be included and that a PDF keeps them.
 */
export const convertDocxToHtml = async (
  arrayBuffer: ArrayBuffer,
): Promise<{ html: string; imageCount: number }> => {
  let imageCount = 0
  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      // The image's bytes are never read; mammoth still writes an `<img>`
      // with the attributes returned here, which is stripped below.
      convertImage: mammoth.images.imgElement(async () => {
        imageCount += 1
        return { src: '' }
      }),
    },
  )
  return { html: result.value.replace(/<img\b[^>]*>/g, ''), imageCount }
}
