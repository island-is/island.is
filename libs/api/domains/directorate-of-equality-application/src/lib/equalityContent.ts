import sanitizeHtml from 'sanitize-html'

/**
 * GraphQL error title for a plan PDF DMR refused on the presigned path (not a
 * PDF, empty, over 4 MB, report no longer editable). The form shows its own
 * message under it. The equality-report template keeps its own copy of this
 * string.
 */
export const EQUALITY_PLAN_REJECTED = 'DoeEqualityPlanRejected'

/**
 * The equality plan as it arrives from the applicant: HTML, an inline PDF, or
 * the key of a PDF already uploaded to DMR's presigned URL.
 */
export type EqualityContentInput = {
  equalityReportContent?: string
  equalityReportPdf?: string
  equalityReportPdfFilename?: string
  equalityReportPdfKey?: string
}

/** The body forwarded to DMR. */
export type EqualityContentBody = {
  equalityReportContent?: string
  equalityReportPdf?: string
  equalityReportPdfFilename?: string
  equalityReportPdfKey?: string
}

/**
 * Content is browser-side HTML converted from an applicant-uploaded DOCX
 * (mammoth doesn't sanitize its output — a document can carry a `javascript:`
 * href straight through), base64-encoded for transport. Strip it down to
 * sanitize-html's default allowlist (which already excludes the `javascript:`
 * scheme) before it reaches DMR, since this module — not the browser — is the
 * actual trust boundary for this payload.
 */
const sanitizeEqualityReportContent = (base64Content: string): string => {
  const html = Buffer.from(base64Content, 'base64').toString('utf-8')
  return Buffer.from(sanitizeHtml(html)).toString('base64')
}

/**
 * Resolves the applicant's content into the body DMR expects.
 *
 * ⚠️ **A PDF is forwarded untouched, and must never reach
 * `sanitizeEqualityReportContent`.** That function round-trips through
 * `toString('utf-8')`, which is lossless only for text: run binary through it
 * and every byte that is not valid UTF-8 becomes U+FFFD, so the file arrives
 * corrupt. Nothing downstream notices — the `%PDF-` header is ASCII and
 * survives, so DMR's signature check still passes — and the damage only
 * surfaces weeks later, when the report is approved and the document cannot be
 * merged.
 *
 * Skipping sanitisation is not a hole in the trust boundary described above.
 * That boundary exists because mammoth emits *markup* we then render; a PDF is
 * an opaque byte stream that nothing in this system interprets as markup — DMR
 * stores it, checks its signature, and serves it back as `application/pdf` for
 * a viewer to render in its own sandbox. There is no injection surface to
 * strip.
 *
 * Deliberately a plain function with no NestJS or logging imports, so it can be
 * tested directly: this project's tsconfig is stricter than the shared
 * libraries it would otherwise pull into the type graph.
 *
 * Passing HTML and an inline PDF at once is left to DMR to reject rather than
 * second-guessed here, so the either/or rule has one definition and one error
 * message. A presigned key is the exception: it wins and goes alone, because a
 * refused key request can fail the upload with it.
 */
export const buildEqualityContentBody = (
  input: EqualityContentInput,
): EqualityContentBody => {
  // A key travels alone with its filename. DMR refuses a key beside any
  // inline content, and the key is single use, so a 400 here would cost the
  // applicant their upload.
  if (input.equalityReportPdfKey) {
    return {
      equalityReportPdfKey: input.equalityReportPdfKey,
      equalityReportPdfFilename: input.equalityReportPdfFilename,
    }
  }

  if (input.equalityReportPdf) {
    return {
      equalityReportPdf: input.equalityReportPdf,
      equalityReportPdfFilename: input.equalityReportPdfFilename,
    }
  }

  return {
    equalityReportContent: input.equalityReportContent
      ? sanitizeEqualityReportContent(input.equalityReportContent)
      : input.equalityReportContent,
  }
}
