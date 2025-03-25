import { formatPhoto } from './formatPhoto'
import { logger } from '@island.is/logging'

jest.mock('@island.is/logging')

describe('formatPhoto', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return undefined if photo is undefined', () => {
    expect(formatPhoto(undefined, 'licenseType')).toBeUndefined()
  })

  it('should return undefined if photo is null', () => {
    expect(formatPhoto(null, 'licenseType')).toBeUndefined()
  })

  it('should return the photo if it has a valid mime type', () => {
    const photo = 'data:image/png;base64,somebase64string'
    expect(formatPhoto(photo, 'licenseType')).toBe(photo)
  })

  it('should log a warning if photo has an invalid mime type', () => {
    const photo = 'data:image/gif;base64,somebase64string'
    formatPhoto(photo, 'licenseType')
    expect(logger.warn).toHaveBeenCalledWith('Invalid photo mime type', {
      licenseType: 'licenseType',
      photoMime: 'image/gif',
    })
  })

  it('should return the photo with default mime type if it does not have a mime type', () => {
    const photo = 'somebase64string'
    expect(formatPhoto(photo, 'licenseType')).toBe(
      'data:image/png;base64,somebase64string',
    )
  })

  it('should return the photo with specified mime type if it does not have a mime type', () => {
    const photo = 'somebase64string'
    expect(formatPhoto(photo, 'licenseType', 'image/jpeg')).toBe(
      'data:image/jpeg;base64,somebase64string',
    )
  })
})
