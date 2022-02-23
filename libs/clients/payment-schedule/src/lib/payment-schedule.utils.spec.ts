import { roundToUpperThousand } from './payment-schedule.utils'

describe('roundToUpperThousand', () => {
  it('should round 1 to 1000', () => {
    expect(roundToUpperThousand(1)).toEqual(1000)
  })

  it('should round 1111 to 2000', () => {
    expect(roundToUpperThousand(1111)).toEqual(2000)
  })

  it('should round 999999 to 1000000', () => {
    expect(roundToUpperThousand(999999)).toEqual(1000000)
  })

  it('should round to 0 to 0', () => {
    expect(roundToUpperThousand(0)).toEqual(0)
  })

  it('should round 1000 to 1000', () => {
    expect(roundToUpperThousand(1000)).toEqual(1000)
  })

  it('should round 100000 to 100000', () => {
    expect(roundToUpperThousand(100000)).toEqual(100000)
  })
})
