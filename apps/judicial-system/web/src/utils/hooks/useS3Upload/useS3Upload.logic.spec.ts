import { resolveUploadFileDefendantId } from './useS3Upload.logic'

describe('resolveUploadFileDefendantId', () => {
  it('keeps the file defendant stamp', () => {
    expect(
      resolveUploadFileDefendantId(
        { defendantId: 'file-defendant' },
        'hook-defendant',
      ),
    ).toBe('file-defendant')
  })

  it('falls back to the hook defendant when the file has no party stamp', () => {
    expect(resolveUploadFileDefendantId({}, 'hook-defendant')).toBe(
      'hook-defendant',
    )
  })

  it('skips the hook defendant fallback when the file is a civil-claimant stamp', () => {
    expect(
      resolveUploadFileDefendantId(
        { civilClaimantId: 'claimant' },
        'hook-defendant',
      ),
    ).toBeUndefined()
  })

  it('keeps the defendant stamp even when a civil-claimant stamp is also present', () => {
    expect(
      resolveUploadFileDefendantId(
        { defendantId: 'file-defendant', civilClaimantId: 'claimant' },
        'hook-defendant',
      ),
    ).toBe('file-defendant')
  })
})
