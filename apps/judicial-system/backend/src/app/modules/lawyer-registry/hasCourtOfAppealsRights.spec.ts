import { hasCourtOfAppealsRights } from './hasCourtOfAppealsRights'

describe('hasCourtOfAppealsRights', () => {
  it('is true for Landsréttur title (lrl.)', () => {
    expect(hasCourtOfAppealsRights({ Title: 'lrl.' })).toBe(true)
  })

  it('is true for Hæstiréttur title (hrl.), which includes Landsréttur', () => {
    expect(hasCourtOfAppealsRights({ Title: 'hrl.' })).toBe(true)
  })

  it('is false for district-court-only title (hdl.)', () => {
    expect(hasCourtOfAppealsRights({ Title: 'hdl.' })).toBe(false)
  })

  it('ignores casing and surrounding whitespace', () => {
    expect(hasCourtOfAppealsRights({ Title: ' LRL. ' })).toBe(true)
  })

  it('is false when Title is missing', () => {
    expect(
      hasCourtOfAppealsRights({
        Title: undefined as unknown as string,
      }),
    ).toBe(false)
  })
})
