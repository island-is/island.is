import { hasCourtOfAppealsRights } from './hasCourtOfAppealsRights'

describe('hasCourtOfAppealsRights', () => {
  it('is true when Title mentions Landsréttur', () => {
    expect(
      hasCourtOfAppealsRights({
        Title:
          'Lögmaður með réttindi til málflutnings fyrir héraðsdómstólum, Landsrétti og Hæstarétti',
        HrlLicense: null,
      }),
    ).toBe(true)
  })

  it('is false when Title only mentions district courts', () => {
    expect(
      hasCourtOfAppealsRights({
        Title:
          'Lögmaður með réttindi til málflutnings fyrir héraðsdómstólum',
        HrlLicense: null,
      }),
    ).toBe(false)
  })

  it('is false when Title is missing', () => {
    expect(
      hasCourtOfAppealsRights({
        Title: undefined as unknown as string,
        HrlLicense: '2001-01-01',
      }),
    ).toBe(false)
  })
})
