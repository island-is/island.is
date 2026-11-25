import { rskRatioToPercent } from './rskRatioToPercent'

describe('rskRatioToPercent', () => {
  it('converts an RSK ratio to whole percent', () => {
    expect(rskRatioToPercent(0.04)).toBe(4)
    expect(rskRatioToPercent(0.115)).toBe(11.5)
    expect(rskRatioToPercent(0.3145)).toBe(31.45)
  })

  it('rounds away binary multiplication artifacts', () => {
    expect(rskRatioToPercent(0.07)).toBe(7)
    expect(rskRatioToPercent(0.29)).toBe(29)
  })

  it('keeps an absent value absent', () => {
    expect(rskRatioToPercent(undefined)).toBeUndefined()
    expect(rskRatioToPercent(null)).toBeUndefined()
  })

  it('preserves zero', () => {
    expect(rskRatioToPercent(0)).toBe(0)
  })
})
