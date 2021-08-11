import { ServerSideFlags, ServerSideFlagsOnTheClientSide } from './server-side'

describe('Server-side feature flags', () => {
  it('should report flag as on if it is present in the list of enabled flags', () => {
    const flags = new ServerSideFlags('do-not-remove-for-testing-only')
    expect(flags.isOn('do-not-remove-for-testing-only')).toBe(true)
  })

  it('should report flag as off if it is not present in the list of enabled flags', () => {
    const flags = new ServerSideFlags('')
    expect(flags.isOn('do-not-remove-for-testing-only')).toBe(false)
  })

  it('should throw an error when used in the browser', () => {
    const flags = new ServerSideFlagsOnTheClientSide()
    expect(() => flags.isOn('do-not-remove-for-testing-only')).toThrowError()
  })
})
