import type { CourtDocumentResponse } from '@island.is/judicial-system-web/src/graphql/schema'
import { CourtDocumentType } from '@island.is/judicial-system-web/src/graphql/schema'

interface MergedCase {
  id: string
  courtCaseNumber?: string | null
}

export interface CourtDocumentSection {
  // The case merged into this one whose copies make up the section, or
  // undefined for a run of the case's own documents.
  mergedFromCaseId?: string
  courtCaseNumber?: string
  // Where the section starts within the court session's filed documents. The
  // court record numbers documents by their place in that one sequence, so
  // this is what turns a position within the section into the number shown.
  offset: number
  documents: CourtDocumentResponse[]
}

export interface UnfiledCourtDocumentSection {
  mergedFromCaseId: string
  courtCaseNumber: string
  documents: CourtDocumentResponse[]
}

const courtCaseNumberOf = (
  caseId: string,
  mergedCases?: readonly MergedCase[] | null,
) =>
  mergedCases?.find((mergedCase) => mergedCase.id === caseId)
    ?.courtCaseNumber ?? ''

// A court session's filed documents are one sequence: the case's own documents
// and, copied in from each case merged into it, a block that stays together.
// Walking the sequence and opening a new section wherever the source case
// changes gives every merged case its own titled section, in the place the
// court record puts it - the court record PDF groups the same documents the
// same way, so what the court arranges on screen is what the record says.
export const groupFiledCourtDocuments = (
  filedDocuments: readonly CourtDocumentResponse[],
  mergedCases?: readonly MergedCase[] | null,
): CourtDocumentSection[] => {
  const sections: CourtDocumentSection[] = []

  filedDocuments.forEach((document, index) => {
    const mergedFromCaseId = document.mergedFromCaseId ?? undefined
    const currentSection = sections[sections.length - 1]

    if (
      currentSection &&
      currentSection.mergedFromCaseId === mergedFromCaseId
    ) {
      currentSection.documents.push(document)

      return
    }

    sections.push({
      mergedFromCaseId,
      courtCaseNumber: mergedFromCaseId
        ? courtCaseNumberOf(mergedFromCaseId, mergedCases)
        : undefined,
      offset: index,
      documents: [document],
    })
  })

  return sections
}

// The documents that are not laid before the court are a pool rather than a
// sequence, so a merged case's copies are collected wherever they sit in it.
// They get a section of their own because that is where they can be filed back
// in: a copy rejoins its own block, never the end of the session.
export const groupUnfiledCourtDocuments = (
  unfiledCourtDocuments: readonly CourtDocumentResponse[],
  mergedCases?: readonly MergedCase[] | null,
): {
  ownDocuments: CourtDocumentResponse[]
  mergedCaseSections: UnfiledCourtDocumentSection[]
} => {
  const ownDocuments: CourtDocumentResponse[] = []
  const mergedCaseSections: UnfiledCourtDocumentSection[] = []

  for (const document of unfiledCourtDocuments) {
    const mergedFromCaseId = document.mergedFromCaseId

    if (!mergedFromCaseId) {
      ownDocuments.push(document)

      continue
    }

    const section = mergedCaseSections.find(
      (mergedCaseSection) =>
        mergedCaseSection.mergedFromCaseId === mergedFromCaseId,
    )

    if (section) {
      section.documents.push(document)
    } else {
      mergedCaseSections.push({
        mergedFromCaseId,
        courtCaseNumber: courtCaseNumberOf(mergedFromCaseId, mergedCases),
        documents: [document],
      })
    }
  }

  return { ownDocuments, mergedCaseSections }
}

// Whether removing a document from a court session leaves it among the case's
// available documents. A copy from a merged case always does - it is never
// destroyed, so that the court can put it back - and so does anything with
// something behind it to open. What is left is a document that was only ever a
// name in the record, which the server deletes outright.
export const isKeptWhenRemovedFromCourtSession = (
  courtDocument: Pick<CourtDocumentResponse, 'documentType'> & {
    mergedFromCaseId?: string | null
  },
): boolean =>
  Boolean(courtDocument.mergedFromCaseId) ||
  courtDocument.documentType !== CourtDocumentType.EXTERNAL_DOCUMENT

// Where a document filed into a court session lands among the ones already
// there. A copy from a merged case rejoins the end of its own case's block,
// which is where the server files it; anything else goes last.
export const insertFiledCourtDocumentAt = (
  filedDocuments: readonly CourtDocumentResponse[],
  courtDocument: CourtDocumentResponse,
): number =>
  courtDocument.mergedFromCaseId
    ? filedDocuments.reduce(
        (at, filedDocument, index) =>
          filedDocument.mergedFromCaseId === courtDocument.mergedFromCaseId
            ? index + 1
            : at,
        filedDocuments.length,
      )
    : filedDocuments.length
