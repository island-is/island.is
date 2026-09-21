import type { CourtDocumentResponse } from '@island.is/judicial-system-web/src/graphql/schema'
import { CourtDocumentType } from '@island.is/judicial-system-web/src/graphql/schema'

interface MergedCase {
  id: string
  courtCaseNumber?: string | null
}

interface CourtSession {
  id: string
  filedDocuments?: CourtDocumentResponse[] | null
}

export interface MergedCaseCourtDocumentSection {
  mergedFromCaseId: string
  courtCaseNumber: string
  // The copies laid before the court in this session, as one contiguous block.
  filedDocuments: CourtDocumentResponse[]
  // The copies the court took out of the record. They are never destroyed, so
  // they are offered back here - and only here, because a copy rejoins its own
  // merged case's block rather than the end of the session.
  unfiledDocuments: CourtDocumentResponse[]
  // Where the block starts among the session's documents as the court record
  // arranges them: the case's own documents first, then one block per merged
  // case. This is what the þingmerkt numbering counts from.
  offset: number
}

export interface CourtSessionDocumentSections {
  ownFiledDocuments: CourtDocumentResponse[]
  ownUnfiledDocuments: CourtDocumentResponse[]
  mergedCaseSections: MergedCaseCourtDocumentSection[]
}

const courtCaseNumberOf = (
  caseId: string,
  mergedCases?: readonly MergedCase[] | null,
) =>
  mergedCases?.find((mergedCase) => mergedCase.id === caseId)
    ?.courtCaseNumber ?? ''

// The court record shows a session as the case's own documents followed by one
// section per merged case, and numbers them in that order. A merged case gets a
// section in the session that holds its block - the server keeps the block
// whole and in one session, so there is exactly one. A merged case whose copies
// have all been taken out of the record has no block anywhere, so its section
// appears under every session, the way the case's own available documents do:
// it can be filed into whichever session the court is writing.
export const groupCourtSessionDocuments = ({
  courtSessionId,
  courtSessions,
  unfiledCourtDocuments,
  mergedCases,
}: {
  courtSessionId: string
  courtSessions?: readonly CourtSession[] | null
  unfiledCourtDocuments?: readonly CourtDocumentResponse[] | null
  mergedCases?: readonly MergedCase[] | null
}): CourtSessionDocumentSections => {
  const filedDocuments =
    courtSessions?.find((courtSession) => courtSession.id === courtSessionId)
      ?.filedDocuments ?? []

  const ownFiledDocuments = filedDocuments.filter(
    (document) => !document.mergedFromCaseId,
  )

  const blockIds: string[] = []
  const blocks = new Map<string, CourtDocumentResponse[]>()

  for (const document of filedDocuments) {
    const mergedFromCaseId = document.mergedFromCaseId

    if (!mergedFromCaseId) {
      continue
    }

    const block = blocks.get(mergedFromCaseId)

    if (block) {
      block.push(document)
    } else {
      blocks.set(mergedFromCaseId, [document])
      blockIds.push(mergedFromCaseId)
    }
  }

  const blockedAnywhere = new Set(
    (courtSessions ?? []).flatMap((courtSession) =>
      (courtSession.filedDocuments ?? []).flatMap((document) =>
        document.mergedFromCaseId ? [document.mergedFromCaseId] : [],
      ),
    ),
  )

  const ownUnfiledDocuments: CourtDocumentResponse[] = []
  const unfiledIds: string[] = []
  const unfiled = new Map<string, CourtDocumentResponse[]>()

  for (const document of unfiledCourtDocuments ?? []) {
    const mergedFromCaseId = document.mergedFromCaseId

    if (!mergedFromCaseId) {
      ownUnfiledDocuments.push(document)

      continue
    }

    const documents = unfiled.get(mergedFromCaseId)

    if (documents) {
      documents.push(document)
    } else {
      unfiled.set(mergedFromCaseId, [document])
      unfiledIds.push(mergedFromCaseId)
    }
  }

  const sectionIds = [
    ...blockIds,
    ...unfiledIds.filter(
      (mergedFromCaseId) => !blockedAnywhere.has(mergedFromCaseId),
    ),
  ]

  let offset = ownFiledDocuments.length

  const mergedCaseSections = sectionIds.map((mergedFromCaseId) => {
    const sectionFiledDocuments = blocks.get(mergedFromCaseId) ?? []
    const section = {
      mergedFromCaseId,
      courtCaseNumber: courtCaseNumberOf(mergedFromCaseId, mergedCases),
      filedDocuments: sectionFiledDocuments,
      unfiledDocuments: unfiled.get(mergedFromCaseId) ?? [],
      offset,
    }

    offset += sectionFiledDocuments.length

    return section
  })

  return { ownFiledDocuments, ownUnfiledDocuments, mergedCaseSections }
}

// The session's documents in the order the court record shows and numbers them.
export const arrangeCourtSessionDocuments = (
  sections: CourtSessionDocumentSections,
): CourtDocumentResponse[] => [
  ...sections.ownFiledDocuments,
  ...sections.mergedCaseSections.flatMap((section) => section.filedDocuments),
]

// The arrangement with one section reordered - the case's own documents when no
// merged case is named, otherwise that merged case's block. Dragging never
// crosses a section: a block is one merged case's part of the record and the
// server refuses to have it broken up or interleaved.
export const reorderCourtSessionSection = (
  sections: CourtSessionDocumentSections,
  mergedFromCaseId: string | undefined,
  newOrder: CourtDocumentResponse[],
): CourtDocumentResponse[] =>
  arrangeCourtSessionDocuments({
    ...sections,
    ownFiledDocuments: mergedFromCaseId ? sections.ownFiledDocuments : newOrder,
    mergedCaseSections: sections.mergedCaseSections.map((section) =>
      section.mergedFromCaseId === mergedFromCaseId
        ? { ...section, filedDocuments: newOrder }
        : section,
    ),
  })

// Where a newly filed document joins the arrangement: at the end of the case's
// own documents, or at the end of its own merged case's block - a merged case
// with no block here starts one at the end. Returns the arrangement and the
// document's place in it, which is the number the court record gives it.
export const placeFiledCourtDocument = (
  sections: CourtSessionDocumentSections,
  courtDocument: CourtDocumentResponse,
): { arrangement: CourtDocumentResponse[]; position: number } => {
  const arrangement = arrangeCourtSessionDocuments(sections)
  const { mergedFromCaseId } = courtDocument

  if (!mergedFromCaseId) {
    const position = sections.ownFiledDocuments.length

    return {
      arrangement: [
        ...arrangement.slice(0, position),
        courtDocument,
        ...arrangement.slice(position),
      ],
      position,
    }
  }

  const section = sections.mergedCaseSections.find(
    (mergedCaseSection) =>
      mergedCaseSection.mergedFromCaseId === mergedFromCaseId &&
      mergedCaseSection.filedDocuments.length > 0,
  )

  const position = section
    ? section.offset + section.filedDocuments.length
    : arrangement.length

  return {
    arrangement: [
      ...arrangement.slice(0, position),
      courtDocument,
      ...arrangement.slice(position),
    ],
    position,
  }
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
