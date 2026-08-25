import { Application } from '@island.is/application/types'
import {
  buildImageField,
  getValueViaPath,
  toBase64DataUrl,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { hasUsableRlsQualityPhoto } from './formUtils'

interface ThjodskraImage {
  biometricId: string
  content: string
  contentSpecification: string
}

type PhotoOption = {
  value: string
  label: typeof m.usePassportImage
  illustration?: ReturnType<typeof buildImageField>
}

// Pre-selects a photo: prefer the first Þjóðskrá facial photo, otherwise the
// RLS quality photo when one exists, otherwise nothing.
export const getSelectLicensePhotoDefaultValue = (
  application: Application,
): string | undefined => {
  const { externalData } = application

  const thjodskraPhotos =
    getValueViaPath<ThjodskraImage[]>(
      externalData,
      'allPhotosFromThjodskra.data.images',
    ) ?? []

  const facialPhotos = thjodskraPhotos.filter(
    (p) => p.contentSpecification === 'FACIAL',
  )

  if (facialPhotos.length > 0) {
    return facialPhotos[0].biometricId
  }

  if (hasUsableRlsQualityPhoto(externalData)) {
    return 'qualityPhoto'
  }

  return undefined
}

export const getSelectLicensePhotoOptions = (
  application: Application,
): PhotoOption[] => {
  const { externalData } = application
  const options: PhotoOption[] = []

  // Thjodskra facial photos
  const thjodskraPhotos =
    getValueViaPath<ThjodskraImage[]>(
      externalData,
      'allPhotosFromThjodskra.data.images',
    ) ?? []

  const facialPhotos = thjodskraPhotos.filter(
    (p) => p.contentSpecification === 'FACIAL',
  )

  for (const photo of facialPhotos) {
    options.push({
      value: photo.biometricId,
      label: m.usePassportImage,
      illustration: buildImageField({
        id: `photo-${photo.biometricId}`,
        image: toBase64DataUrl(photo.content),
      }),
    })
  }

  // Quality photo from getqualityphotoandsignature. The binary (`pohto` — the
  // provider's misspelled key) may be null for legacy records — toBase64DataUrl
  // falls back to a placeholder, and submission resolves the photo by
  // reference, so offer the option whenever a record exists.
  if (hasUsableRlsQualityPhoto(externalData)) {
    const photoAndSig = getValueViaPath<{ pohto?: string | null }>(
      externalData,
      'qualityPhotoAndSignature.data',
    )
    options.push({
      value: 'qualityPhoto',
      label: m.useDriversLicenseImage,
      illustration: buildImageField({
        id: 'qualityPhoto-illustration',
        image: toBase64DataUrl(photoAndSig?.pohto ?? undefined),
      }),
    })
  }

  return options
}
