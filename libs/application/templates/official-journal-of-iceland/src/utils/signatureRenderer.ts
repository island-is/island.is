/**
 * Utilities to render the OJOI structured signature data into the
 * free-text signatureText HTML format used by the regulations-admin DB.
 *
 * The regulations-admin stores signatures as free-form HTML like:
 *   <p class="Dags" align="center"><em>Ráðuneytinu, 1. janúar 2026.</em></p>
 *   <p class="FHUndirskr" align="center">F. h. r.</p>
 *   <p class="Undirritun" align="center"><strong>NAFN</strong></p>
 *
 * The OJOI application stores signatures as structured records:
 *   signature.regular.records[].institution, .signatureDate, .members[], .chairman
 */

type MemberItem = {
  name?: string
  before?: string
  below?: string
  above?: string
  after?: string
}

type SignatureRecord = {
  institution?: string
  signatureDate?: string
  chairman?: MemberItem
  members?: MemberItem[]
  additional?: string
}

type SignatureData = {
  regular?: {
    records?: SignatureRecord[]
  }
  committee?: {
    records?: SignatureRecord[]
  }
}

/**
 * Render a single member into HTML paragraph(s).
 */
const renderMember = (member: MemberItem, isChairman = false): string => {
  const parts: string[] = []

  if (member.above) {
    parts.push(
      `<p class="Undirritun" align="center"><em>${escapeHtml(
        member.above,
      )}</em></p>`,
    )
  }

  if (member.before) {
    parts.push(
      `<p class="Undirritun" align="center"><em>${escapeHtml(
        member.before,
      )}</em></p>`,
    )
  }

  const name = member.name ?? ''
  if (isChairman) {
    parts.push(
      `<p class="Undirritun" align="center"><strong>${escapeHtml(
        name,
      )}</strong>, formaður</p>`,
    )
  } else {
    parts.push(
      `<p class="Undirritun" align="center"><strong>${escapeHtml(
        name,
      )}</strong></p>`,
    )
  }

  if (member.below) {
    parts.push(
      `<p class="Undirritun" align="center"><em>${escapeHtml(
        member.below,
      )}</em></p>`,
    )
  }

  if (member.after) {
    parts.push(
      `<p class="Undirritun" align="center"><em>${escapeHtml(
        member.after,
      )}</em></p>`,
    )
  }

  return parts.join('\n')
}

/**
 * Render a single signature record (institution + date + members).
 */
const renderRecord = (record: SignatureRecord): string => {
  const parts: string[] = []

  // Date and institution line
  if (record.institution || record.signatureDate) {
    const institution = record.institution ?? ''
    const date = record.signatureDate
      ? formatSignatureDate(record.signatureDate)
      : ''
    const dateStr = date ? `, ${date}.` : '.'
    parts.push(
      `<p class="Dags" align="center"><em>${escapeHtml(
        institution,
      )}${dateStr}</em></p>`,
    )
  }

  // Chairman (for committee signatures)
  if (record.chairman?.name) {
    parts.push(renderMember(record.chairman, true))
  }

  // Members
  if (record.members && record.members.length > 0) {
    for (const member of record.members) {
      if (member.name) {
        parts.push(renderMember(member))
      }
    }
  }

  // Additional text
  if (record.additional) {
    parts.push(
      `<p class="Undirritun" align="center"><em>${escapeHtml(
        record.additional,
      )}</em></p>`,
    )
  }

  return parts.join('\n')
}

/**
 * Render structured OJOI signature answers into signatureText HTML
 * for the regulations-admin DB.
 */
export const renderSignatureToText = (
  signature: Record<string, unknown> | undefined,
): string | undefined => {
  if (!signature) return undefined

  const sig = signature as unknown as SignatureData
  const records = sig.committee?.records ?? sig.regular?.records ?? []

  if (!records || records.length === 0) return undefined

  const rendered = records.map(renderRecord).filter(Boolean)
  return rendered.join('\n')
}

/**
 * Extract the signature date from structured signature data.
 * Returns the first record's signatureDate as ISO string.
 */
export const renderSignatureToDate = (
  signature: Record<string, unknown> | undefined,
): string | undefined => {
  if (!signature) return undefined

  const sig = signature as unknown as SignatureData
  const records = sig.regular?.records ?? sig.committee?.records ?? []

  const firstRecord = records?.[0]
  return firstRecord?.signatureDate ?? undefined
}

/**
 * Format an ISO date string into the Icelandic format used in regulation signatures.
 * e.g. "2026-01-15" → "15. janúar 2026"
 */
const formatSignatureDate = (isoDate: string): string => {
  try {
    const date = new Date(isoDate)
    if (isNaN(date.getTime())) return isoDate

    const months = [
      'janúar',
      'febrúar',
      'mars',
      'apríl',
      'maí',
      'júní',
      'júlí',
      'ágúst',
      'september',
      'október',
      'nóvember',
      'desember',
    ]

    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()

    return `${day}. ${month} ${year}`
  } catch {
    return isoDate
  }
}

/**
 * Simple HTML escape for text content.
 */
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
