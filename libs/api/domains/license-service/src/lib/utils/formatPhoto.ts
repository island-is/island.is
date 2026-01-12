import { logger } from '@island.is/logging'

const validMimeTypes = ['image/png', 'image/jpeg'] as const
type ValidMimeType = typeof validMimeTypes[number]

export const formatPhoto = (
  photo: string | undefined | null,
  licenseType: string,
  mime: ValidMimeType = 'image/png',
): string | undefined => {
  if (!photo) {
    return undefined
  }
  const photoMime = /^data:(.*?);/.exec(photo)?.[1]
  if (photoMime) {
    if (!validMimeTypes.includes(photoMime as ValidMimeType)) {
      logger.warn('Invalid photo mime type', {
        licenseType,
        photoMime,
      })
    }
    return photo
  }

  return `data:${mime};base64,${photo}`
}
