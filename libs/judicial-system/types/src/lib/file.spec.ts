import {
  CaseFileCategory,
  isAppealFileDeletionLocked,
  isRulingOrderWithoutDocument,
} from './file'

describe('isRulingOrderWithoutDocument', () => {
  it('should be true for a ruling order pronounced orally that has no key', () => {
    expect(
      isRulingOrderWithoutDocument({
        category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
        isPronouncedOrally: true,
        key: '',
      }),
    ).toBe(true)
  })

  it('should be false once the ruling has been written up', () => {
    expect(
      isRulingOrderWithoutDocument({
        category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
        isPronouncedOrally: true,
        key: 'case-id/file-id/ruling.pdf',
      }),
    ).toBe(false)
  })

  it('should be false for a ruling order that was uploaded before being pronounced', () => {
    expect(
      isRulingOrderWithoutDocument({
        category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
        key: 'case-id/file-id/ruling.pdf',
      }),
    ).toBe(false)
  })

  it('should be false for a file of another category', () => {
    expect(
      isRulingOrderWithoutDocument({
        category: CaseFileCategory.RULING,
        isPronouncedOrally: true,
        key: '',
      }),
    ).toBe(false)
  })

  it('should tolerate missing fields', () => {
    expect(isRulingOrderWithoutDocument({})).toBe(false)
    expect(
      isRulingOrderWithoutDocument({
        category: null,
        isPronouncedOrally: null,
        key: null,
      }),
    ).toBe(false)
  })
})

describe('isAppealFileDeletionLocked', () => {
  it('should not lock anything when there is no appeal', () => {
    expect(
      isAppealFileDeletionLocked(CaseFileCategory.DEFENDANT_APPEAL_BRIEF, null),
    ).toBe(false)
    expect(
      isAppealFileDeletionLocked(
        CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
        undefined,
      ),
    ).toBe(false)
  })

  it('should lock an appeal file only once the court of appeals has a case number', () => {
    expect(
      isAppealFileDeletionLocked(CaseFileCategory.DEFENDANT_APPEAL_BRIEF, {
        appealCaseNumber: null,
      }),
    ).toBe(false)
    expect(
      isAppealFileDeletionLocked(CaseFileCategory.DEFENDANT_APPEAL_BRIEF, {
        appealCaseNumber: 'LRE-1/2026',
      }),
    ).toBe(true)
  })

  // The declaration is the verdict appeal itself, filed long before Landsréttur has a
  // case number, so it locks as soon as the appeal exists.
  it('should lock an appeal declaration as soon as the appeal exists', () => {
    expect(
      isAppealFileDeletionLocked(
        CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
        { appealCaseNumber: null },
      ),
    ).toBe(true)
    expect(
      isAppealFileDeletionLocked(
        CaseFileCategory.DEFENDANT_APPEAL_DECLARATION_CASE_FILE,
        { appealCaseNumber: null },
      ),
    ).toBe(true)
  })

  it('should not lock a file that has nothing to do with an appeal', () => {
    expect(
      isAppealFileDeletionLocked(CaseFileCategory.COURT_RECORD, {
        appealCaseNumber: 'LRE-1/2026',
      }),
    ).toBe(false)
  })
})
