import type { CourtDocumentResponse } from '@island.is/judicial-system-web/src/graphql/schema'
import { CourtDocumentType } from '@island.is/judicial-system-web/src/graphql/schema'

import {
  groupFiledCourtDocuments,
  groupUnfiledCourtDocuments,
  insertFiledCourtDocumentAt,
  isKeptWhenRemovedFromCourtSession,
} from './CourtSessionAccordionItem.logic'

const courtDocument = (
  id: string,
  mergedFromCaseId?: string,
): CourtDocumentResponse =>
  ({ id, mergedFromCaseId } as unknown as CourtDocumentResponse)

const mergedCases = [
  { id: 'merged-1', courtCaseNumber: 'S-1/2025' },
  { id: 'merged-2', courtCaseNumber: 'S-2/2025' },
]

describe('groupFiledCourtDocuments', () => {
  it('should make one section of the case own documents', () => {
    const sections = groupFiledCourtDocuments(
      [courtDocument('a'), courtDocument('b')],
      mergedCases,
    )

    expect(sections).toHaveLength(1)
    expect(sections[0].mergedFromCaseId).toBeUndefined()
    expect(sections[0].offset).toBe(0)
    expect(sections[0].documents.map((d) => d.id)).toEqual(['a', 'b'])
  })

  it('should give each merged case its own section, titled with its court case number', () => {
    const sections = groupFiledCourtDocuments(
      [
        courtDocument('a'),
        courtDocument('b', 'merged-1'),
        courtDocument('c', 'merged-1'),
        courtDocument('d', 'merged-2'),
      ],
      mergedCases,
    )

    expect(
      sections.map((section) => [
        section.mergedFromCaseId,
        section.courtCaseNumber,
        section.offset,
        section.documents.map((d) => d.id),
      ]),
    ).toEqual([
      [undefined, undefined, 0, ['a']],
      ['merged-1', 'S-1/2025', 1, ['b', 'c']],
      ['merged-2', 'S-2/2025', 3, ['d']],
    ])
  })

  // The offset is what the court record numbers by, so a document added to the
  // session after a merge - which the server files last, behind the blocks -
  // has to keep the number its place in the sequence gives it.
  it('should number a section from where it starts in the session', () => {
    const sections = groupFiledCourtDocuments(
      [
        courtDocument('a'),
        courtDocument('b', 'merged-1'),
        courtDocument('c', 'merged-1'),
        courtDocument('d'),
      ],
      mergedCases,
    )

    expect(sections.map((section) => section.offset)).toEqual([0, 1, 3])
    expect(sections[2].mergedFromCaseId).toBeUndefined()
    expect(sections[2].documents.map((d) => d.id)).toEqual(['d'])
  })

  it('should title a merged case with no court case number with an empty string', () => {
    const sections = groupFiledCourtDocuments(
      [courtDocument('a', 'merged-3')],
      mergedCases,
    )

    expect(sections[0].courtCaseNumber).toBe('')
  })

  it('should make no sections of no documents', () => {
    expect(groupFiledCourtDocuments([], mergedCases)).toEqual([])
  })
})

describe('groupUnfiledCourtDocuments', () => {
  it('should keep the case own available documents apart from the copies', () => {
    const { ownDocuments, mergedCaseSections } = groupUnfiledCourtDocuments(
      [
        courtDocument('a'),
        courtDocument('b', 'merged-1'),
        courtDocument('c'),
        courtDocument('d', 'merged-2'),
        courtDocument('e', 'merged-1'),
      ],
      mergedCases,
    )

    expect(ownDocuments.map((d) => d.id)).toEqual(['a', 'c'])
    expect(
      mergedCaseSections.map((section) => [
        section.mergedFromCaseId,
        section.courtCaseNumber,
        section.documents.map((d) => d.id),
      ]),
    ).toEqual([
      ['merged-1', 'S-1/2025', ['b', 'e']],
      ['merged-2', 'S-2/2025', ['d']],
    ])
  })

  it('should list no merged case sections when nothing was removed from a block', () => {
    const { ownDocuments, mergedCaseSections } = groupUnfiledCourtDocuments(
      [courtDocument('a')],
      mergedCases,
    )

    expect(ownDocuments.map((d) => d.id)).toEqual(['a'])
    expect(mergedCaseSections).toEqual([])
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

describe('insertFiledCourtDocumentAt', () => {
  const filedDocuments = [
    courtDocument('a'),
    courtDocument('b', 'merged-1'),
    courtDocument('c', 'merged-1'),
    courtDocument('d', 'merged-2'),
  ]

  it('should file one of the case own documents last', () => {
    expect(insertFiledCourtDocumentAt(filedDocuments, courtDocument('e'))).toBe(
      4,
    )
  })

  it('should file a copy at the end of its own block', () => {
    expect(
      insertFiledCourtDocumentAt(
        filedDocuments,
        courtDocument('e', 'merged-1'),
      ),
    ).toBe(3)
  })

  it('should file a copy last when its merged case has no block in the session yet', () => {
    expect(
      insertFiledCourtDocumentAt(
        filedDocuments,
        courtDocument('e', 'merged-3'),
      ),
    ).toBe(4)
  })
})
