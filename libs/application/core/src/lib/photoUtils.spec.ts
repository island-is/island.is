import { toBase64DataUrl } from './photoUtils'

const PLACEHOLDER_PREFIX = 'data:image/svg+xml;base64,'
const validBase64 = 'a'.repeat(200)

const isPlaceholder = (dataUrl: string) =>
  dataUrl.startsWith(PLACEHOLDER_PREFIX)

describe('toBase64DataUrl', () => {
  it('should return the placeholder when no photo data is provided', () => {
    expect(isPlaceholder(toBase64DataUrl())).toBe(true)
    expect(isPlaceholder(toBase64DataUrl(''))).toBe(true)
  })

  it('should build a jpeg data url from valid base64 data', () => {
    expect(toBase64DataUrl(validBase64)).toBe(
      `data:image/jpeg;base64,${validBase64}`,
    )
  })

  it('should strip surrounding quotes and escape characters', () => {
    expect(toBase64DataUrl(`"${validBase64}"`)).toBe(
      `data:image/jpeg;base64,${validBase64}`,
    )
    expect(toBase64DataUrl(`'${validBase64}'`)).toBe(
      `data:image/jpeg;base64,${validBase64}`,
    )
    expect(toBase64DataUrl(`"${validBase64}\\\\"`)).toBe(
      `data:image/jpeg;base64,${validBase64}`,
    )
  })

  it('should return the placeholder for data that is too short to be a photo', () => {
    expect(isPlaceholder(toBase64DataUrl('fakePhoto'))).toBe(true)
  })

  it('should return the placeholder when the data contains non base64 characters', () => {
    expect(isPlaceholder(toBase64DataUrl(`${validBase64}!`))).toBe(true)
  })
})
