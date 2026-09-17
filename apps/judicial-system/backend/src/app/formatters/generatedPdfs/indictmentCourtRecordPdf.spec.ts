import {
  CaseFileCategory,
  CourtDocumentType,
} from '@island.is/judicial-system/types'

import { getFiledBy, groupFiledDocuments } from './indictmentCourtRecordPdf'

describe('getFiledBy', () => {
  it('omits prosecutor name for external documents filed by a prosecutor', () => {
    const result = getFiledBy(
      {
        documentType: CourtDocumentType.EXTERNAL_DOCUMENT,
        submittedBy: `Jane Doe|${CaseFileCategory.PROSECUTOR_CASE_FILE}`,
      } as never,
      [],
    )

    expect(result).toBe('Ákærandi lagði fram:')
  })

  it('omits prosecutor name for uploaded documents filed by a prosecutor', () => {
    const result = getFiledBy(
      {
        documentType: CourtDocumentType.UPLOADED_DOCUMENT,
        caseFileId: 'file-1',
      } as never,
      [
        {
          id: 'file-1',
          category: CaseFileCategory.PROSECUTOR_CASE_FILE,
          submittedBy: 'Jane Doe',
        } as never,
      ],
    )

    expect(result).toBe('Ákærandi lagði fram:')
  })

  it('keeps non-prosecutor names in the returned string', () => {
    const result = getFiledBy(
      {
        documentType: CourtDocumentType.UPLOADED_DOCUMENT,
        caseFileId: 'file-1',
      } as never,
      [
        {
          id: 'file-1',
          category: CaseFileCategory.DEFENDANT_CASE_FILE,
          submittedBy: 'Jane Doe',
        } as never,
      ],
    )

    expect(result).toBe('Verjandi Jane Doe lagði fram:')
  })
})

describe('groupFiledDocuments', () => {
  const uploaded = (
    id: string,
    documentOrder: number,
    mergedFromCaseId?: string,
  ) =>
    ({
      id,
      documentOrder,
      mergedFromCaseId,
      name: id,
      documentType: CourtDocumentType.UPLOADED_DOCUMENT,
    } as never)

  it('groups the case own documents by who laid them before the court', () => {
    const sections = groupFiledDocuments(
      [uploaded('a', 1), uploaded('b', 2), uploaded('c', 3)],
      [],
    )

    expect(sections).toHaveLength(1)
    expect(sections[0].mergedFromCaseId).toBeUndefined()
    expect(sections[0].docs.map((d) => d.id)).toEqual(['a', 'b', 'c'])
  })

  // Each merged case is its own section of the record, told apart from the
  // case's own documents and from each other.
  it('gives each merged case a section of its own', () => {
    const first = 'merged-case-1'
    const second = 'merged-case-2'

    const sections = groupFiledDocuments(
      [
        uploaded('own', 1),
        uploaded('a', 2, first),
        uploaded('b', 3, first),
        uploaded('c', 4, second),
      ],
      [],
    )

    expect(
      sections.map((section) => [
        section.mergedFromCaseId,
        section.docs.map((d) => d.id),
      ]),
    ).toEqual([
      [undefined, ['own']],
      [first, ['a', 'b']],
      [second, ['c']],
    ])
  })

  // The numbering in the record comes from the documents' own order, so a
  // merged case's section starts where its block starts.
  it('starts each section at the order of its first document', () => {
    const sections = groupFiledDocuments(
      [uploaded('own', 5), uploaded('a', 6, 'merged-case-1')],
      [],
    )

    expect(sections.map((section) => section.docs[0].documentOrder)).toEqual([
      5, 6,
    ])
  })
})
