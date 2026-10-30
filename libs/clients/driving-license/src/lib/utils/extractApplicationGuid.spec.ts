import { extractApplicationGuid } from './extractApplicationGuid'

const GUID = '3630b0bc-ec51-442e-976d-13a3c21c5e5b'

describe('extractApplicationGuid', () => {
  it.each([
    ['a bare guid string', GUID, GUID],
    ['a quoted guid string', `"${GUID}"`, GUID],
    ['the full endpoint text body (id, no guid)', '3248752', null],
    ['an empty string', '', null],
    // The temporary endpoint carries the guid under a field the DTO drops.
    ['a guid field', { guid: GUID }, GUID],
    ['an applicationGuid field', { applicationGuid: GUID }, GUID],
    ['a guid anywhere in the object', { result: true, x: { g: GUID } }, GUID],
    ['an object with no guid', { result: false, driverLicenseId: 7 }, null],
    ['a wrapped zero', { value: 0 }, null],
    ['null', null, null],
    ['undefined', undefined, null],
    ['a number', 3248752, null],
  ])('%s -> %s', (_label, input, expected) => {
    expect(extractApplicationGuid(input)).toBe(expected)
  })

  it('never throws on hostile input', () => {
    const circular: Record<string, unknown> = {}
    circular.self = circular
    expect(() => extractApplicationGuid(circular)).not.toThrow()
  })
})
