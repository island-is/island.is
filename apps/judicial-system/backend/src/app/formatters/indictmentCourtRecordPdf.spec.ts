import {
  CaseFileCategory,
  CourtDocumentType,
} from '@island.is/judicial-system/types'

import { getFiledBy } from './indictmentCourtRecordPdf'

describe('getFiledBy', () => {
  it('omits prosecutor name for external documents filed by a prosecutor', () => {
    const result = getFiledBy(
      {
        documentType: CourtDocumentType.EXTERNAL_DOCUMENT,
        submittedBy: `Jane Doe|${CaseFileCategory.PROSECUTOR_CASE_FILE}`,
      } as never,
      [],
    )

    expect(result).toBe('Sækjandi lagði fram:')
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

    expect(result).toBe('Sækjandi lagði fram:')
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
