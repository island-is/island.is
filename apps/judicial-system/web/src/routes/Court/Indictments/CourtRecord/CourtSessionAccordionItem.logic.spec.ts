import type { CourtDocumentResponse } from '@island.is/judicial-system-web/src/graphql/schema'
import { CourtDocumentType } from '@island.is/judicial-system-web/src/graphql/schema'

import {
  arrangeCourtSessionDocuments,
  groupCourtSessionDocuments,
  isKeptWhenRemovedFromCourtSession,
  placeFiledCourtDocument,
  reorderCourtSessionSection,
} from './CourtSessionAccordionItem.logic'

const courtDocument = (
  id: string,
  mergedFromCaseId?: string,
): CourtDocumentResponse =>
  ({ id, mergedFromCaseId } as unknown as CourtDocumentResponse)

const ids = (documents: CourtDocumentResponse[]) =>
  documents.map((document) => document.id)

const mergedCases = [
  { id: 'merged-1', courtCaseNumber: 'S-1/2025' },
  { id: 'merged-2', courtCaseNumber: 'S-2/2025' },
]

describe('groupCourtSessionDocuments', () => {
  it('should keep the case own documents apart from each merged case block', () => {
    const sections = groupCourtSessionDocuments({
      courtSessionId: 'session-1',
      courtSessions: [
        {
          id: 'session-1',
          filedDocuments: [
            courtDocument('a'),
            courtDocument('b', 'merged-1'),
            courtDocument('c', 'merged-1'),
            courtDocument('d', 'merged-2'),
          ],
        },
      ],
      mergedCases,
    })

    expect(ids(sections.ownFiledDocuments)).toEqual(['a'])
    expect(
      sections.mergedCaseSections.map((section) => [
        section.mergedFromCaseId,
        section.courtCaseNumber,
        section.offset,
        ids(section.filedDocuments),
      ]),
    ).toEqual([
      ['merged-1', 'S-1/2025', 1, ['b', 'c']],
      ['merged-2', 'S-2/2025', 3, ['d']],
    ])
  })

  // The court record lists the case's own documents first, whatever order the
  // server happens to hold them in - it files a document added during the
  // session at the very end, behind the blocks.
  it('should list the case own documents first and number them from the top', () => {
    const sections = groupCourtSessionDocuments({
      courtSessionId: 'session-1',
      courtSessions: [
        {
          id: 'session-1',
          filedDocuments: [
            courtDocument('a'),
            courtDocument('b', 'merged-1'),
            courtDocument('c', 'merged-1'),
            courtDocument('d'),
          ],
        },
      ],
      mergedCases,
    })

    expect(ids(sections.ownFiledDocuments)).toEqual(['a', 'd'])
    expect(sections.mergedCaseSections[0].offset).toBe(2)
    expect(ids(arrangeCourtSessionDocuments(sections))).toEqual([
      'a',
      'd',
      'b',
      'c',
    ])
  })

  it('should offer each merged case its own removed documents', () => {
    const sections = groupCourtSessionDocuments({
      courtSessionId: 'session-1',
      courtSessions: [
        { id: 'session-1', filedDocuments: [courtDocument('b', 'merged-1')] },
      ],
      unfiledCourtDocuments: [
        courtDocument('x'),
        courtDocument('y', 'merged-1'),
      ],
      mergedCases,
    })

    expect(ids(sections.ownUnfiledDocuments)).toEqual(['x'])
    expect(ids(sections.mergedCaseSections[0].unfiledDocuments)).toEqual(['y'])
  })

  // A copy rejoins its own block, and the server keeps the block in one
  // session, so offering it under a session that does not hold the block would
  // only produce a filing the server refuses.
  it('should not offer a merged case under a session that does not hold its block', () => {
    const sections = groupCourtSessionDocuments({
      courtSessionId: 'session-2',
      courtSessions: [
        { id: 'session-1', filedDocuments: [courtDocument('b', 'merged-1')] },
        { id: 'session-2', filedDocuments: [courtDocument('a')] },
      ],
      unfiledCourtDocuments: [courtDocument('y', 'merged-1')],
      mergedCases,
    })

    expect(sections.mergedCaseSections).toEqual([])
  })

  // With no block anywhere the copies can be filed into whichever session the
  // court is writing, so the section follows the case's own available
  // documents and appears under every session.
  it('should offer a merged case whose documents were all removed under every session', () => {
    const sections = groupCourtSessionDocuments({
      courtSessionId: 'session-2',
      courtSessions: [
        { id: 'session-1', filedDocuments: [] },
        { id: 'session-2', filedDocuments: [courtDocument('a')] },
      ],
      unfiledCourtDocuments: [courtDocument('y', 'merged-1')],
      mergedCases,
    })

    expect(sections.mergedCaseSections).toHaveLength(1)
    expect(sections.mergedCaseSections[0].mergedFromCaseId).toBe('merged-1')
    expect(sections.mergedCaseSections[0].filedDocuments).toEqual([])
    expect(ids(sections.mergedCaseSections[0].unfiledDocuments)).toEqual(['y'])
  })

  it('should title a merged case with no court case number with an empty string', () => {
    const sections = groupCourtSessionDocuments({
      courtSessionId: 'session-1',
      courtSessions: [
        { id: 'session-1', filedDocuments: [courtDocument('a', 'merged-3')] },
      ],
      mergedCases,
    })

    expect(sections.mergedCaseSections[0].courtCaseNumber).toBe('')
  })
})

describe('reorderCourtSessionSection', () => {
  const sections = groupCourtSessionDocuments({
    courtSessionId: 'session-1',
    courtSessions: [
      {
        id: 'session-1',
        filedDocuments: [
          courtDocument('a'),
          courtDocument('b'),
          courtDocument('c', 'merged-1'),
          courtDocument('d', 'merged-1'),
        ],
      },
    ],
    mergedCases,
  })

  it('should reorder the case own documents without touching the blocks', () => {
    expect(
      ids(
        reorderCourtSessionSection(sections, undefined, [
          courtDocument('b'),
          courtDocument('a'),
        ]),
      ),
    ).toEqual(['b', 'a', 'c', 'd'])
  })

  it('should reorder one block without touching the rest', () => {
    expect(
      ids(
        reorderCourtSessionSection(sections, 'merged-1', [
          courtDocument('d', 'merged-1'),
          courtDocument('c', 'merged-1'),
        ]),
      ),
    ).toEqual(['a', 'b', 'd', 'c'])
  })
})

describe('placeFiledCourtDocument', () => {
  const sections = groupCourtSessionDocuments({
    courtSessionId: 'session-1',
    courtSessions: [
      {
        id: 'session-1',
        filedDocuments: [
          courtDocument('a'),
          courtDocument('b', 'merged-1'),
          courtDocument('c', 'merged-2'),
        ],
      },
    ],
    mergedCases,
  })

  // The server files it at the very end of the session; the record shows the
  // case's own documents first, so this is where it belongs.
  it('should place one of the case own documents after the other own documents', () => {
    const { arrangement, position } = placeFiledCourtDocument(
      sections,
      courtDocument('new'),
    )

    expect(position).toBe(1)
    expect(ids(arrangement)).toEqual(['a', 'new', 'b', 'c'])
  })

  it('should place a copy at the end of its own block', () => {
    const { arrangement, position } = placeFiledCourtDocument(
      sections,
      courtDocument('new', 'merged-1'),
    )

    expect(position).toBe(2)
    expect(ids(arrangement)).toEqual(['a', 'b', 'new', 'c'])
  })

  it('should start a block at the end for a merged case with none here', () => {
    const { arrangement, position } = placeFiledCourtDocument(
      sections,
      courtDocument('new', 'merged-3'),
    )

    expect(position).toBe(3)
    expect(ids(arrangement)).toEqual(['a', 'b', 'c', 'new'])
  })
})

describe('isKeptWhenRemovedFromCourtSession', () => {
  it('should keep a copy from a merged case, whatever kind of document it is', () => {
    expect(
      isKeptWhenRemovedFromCourtSession({
        documentType: CourtDocumentType.EXTERNAL_DOCUMENT,
        mergedFromCaseId: 'merged-1',
      }),
    ).toBe(true)
  })

  it('should keep the case own uploaded and generated documents', () => {
    expect(
      isKeptWhenRemovedFromCourtSession({
        documentType: CourtDocumentType.UPLOADED_DOCUMENT,
      }),
    ).toBe(true)
    expect(
      isKeptWhenRemovedFromCourtSession({
        documentType: CourtDocumentType.GENERATED_DOCUMENT,
      }),
    ).toBe(true)
  })

  it('should not keep one of the case own documents that is only a name', () => {
    expect(
      isKeptWhenRemovedFromCourtSession({
        documentType: CourtDocumentType.EXTERNAL_DOCUMENT,
      }),
    ).toBe(false)
  })
})
