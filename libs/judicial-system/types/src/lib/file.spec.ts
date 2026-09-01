import { CaseFileCategory, isRulingOrderWithoutDocument } from './file'

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
