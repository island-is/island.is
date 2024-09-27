import { isHealthInsured } from './isHealthInsured'

describe('isHealthInsured', () => {
  const healthInsured = {
    accidentDetails: {
      isHealthInsured: 'yes',
    },
  }

  const notHealthInsured = {
    accidentDetails: {
      isHealthInsured: 'no',
    },
  }

  it('should return true when health insured is yes', () => {
    expect(isHealthInsured(healthInsured)).toEqual(true)
  })

  it('should return false when health insured is no', () => {
    expect(isHealthInsured(notHealthInsured)).toEqual(false)
  })

  it('should return true when health insured is undefined', () => {
    expect(isHealthInsured({})).toEqual(true)
  })
})
