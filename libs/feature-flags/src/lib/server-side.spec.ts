import {
  ServerSideFeatures,
  ServerSideFeaturesOnTheClientSide,
} from './server-side'

describe('Server-side feature flags', () => {
  it('should report flag as on if it is present in the list of enabled flags', () => {
    const flags = new ServerSideFeatures('do-not-remove-for-testing-only')
    expect(flags.isOn('do-not-remove-for-testing-only')).toBe(true)
  })

  it('should report flag as off if it is not present in the list of enabled flags', () => {
    const flags = new ServerSideFeatures('')
    expect(flags.isOn('do-not-remove-for-testing-only')).toBe(false)
  })

  it('should throw an error when used in the browser', () => {
    const flags = new ServerSideFeaturesOnTheClientSide()
    expect(() => flags.isOn('do-not-remove-for-testing-only')).toThrowError()
  })

  it('should throw an error when no flags info provided', () => {
    const flags = new ServerSideFeatures()
    expect(() => flags.isOn('do-not-remove-for-testing-only')).toThrowError()
  })
})
