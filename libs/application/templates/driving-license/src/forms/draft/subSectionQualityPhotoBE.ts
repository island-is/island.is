import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildDescriptionField,
  buildImageField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { BE, QUALITY_IMAGE_TYPE_IDS } from '../../lib/constants'
import { hasNoDrivingLicenseInOtherCountry, isVisible } from '../../lib/utils'

const PLACEHOLDER_SRC =
  'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48Y2lyY2xlIGN4PSIzMiIgY3k9IjIwIiByPSIxMiIvPjxwYXRoIGQ9Ik0xMiA1MmMwLTExLjMgOS4yLTE2IDIwLTE2czIwIDQuNyAyMCAxNmgtNDB6Ii8+PC9zdmc+'

const toBase64DataUrl = (photoData?: string): string => {
  if (!photoData) return PLACEHOLDER_SRC

  let cleaned = photoData
  const first = cleaned[0]
  if (
    (first === '"' || first === "'") &&
    cleaned.length >= 2 &&
    cleaned[cleaned.length - 1] === first
  ) {
    cleaned = cleaned.substring(1, cleaned.length - 1).replace(/\\/g, '')
  }

  const isValidBase64 =
    cleaned.length > 100 && !/[^A-Za-z0-9+/=]/.test(cleaned)

  return isValidBase64 ? `data:image/jpeg;base64,${cleaned}` : PLACEHOLDER_SRC
}

interface ThjodskraImage {
  biometricId: string
  content: string
  contentSpecification: string
}

export const subSectionQualityPhotoBE = buildSubSection({
  id: 'photoStepBE',
  title: m.photoSelectionTitle,
  condition: isVisible(
    (answers) => answers.applicationFor === BE,
    hasNoDrivingLicenseInOtherCountry,
  ),
  children: [
    buildMultiField({
      id: 'selectPhoto',
      title: m.photoSelectionTitle,
      description: m.photoSelectionDescription,
      children: [
        buildRadioField({
          id: 'selectLicensePhoto',
          title: '',
          disabled: false,
          defaultValue: (application: Application) => {
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

            const photoAndSig = getValueViaPath<{
              imageTypeId?: number | null
              pohto?: string | null
            }>(externalData, 'qualityPhotoAndSignature.data')

            if (
              photoAndSig?.pohto &&
              QUALITY_IMAGE_TYPE_IDS.includes(photoAndSig?.imageTypeId ?? 0)
            ) {
              return 'qualityPhoto'
            }

            return undefined
          },
          options: ({ externalData }) => {
            const options: Array<{
              value: string
              label: typeof m.usePassportImage
              illustration?: ReturnType<typeof buildImageField>
            }> = []

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

            // Quality photo from getqualityphotoandsignature
            const photoAndSig = getValueViaPath<{
              imageTypeId?: number | null
              pohto?: string | null
            }>(externalData, 'qualityPhotoAndSignature.data')

            if (
              photoAndSig?.pohto &&
              QUALITY_IMAGE_TYPE_IDS.includes(photoAndSig?.imageTypeId ?? 0)
            ) {
              options.push({
                value: 'qualityPhoto',
                label: m.useDriversLicenseImage,
                illustration: buildImageField({
                  id: 'qualityPhoto-illustration',
                  image: toBase64DataUrl(photoAndSig.pohto ?? undefined),
                }),
              })
            }

            return options
          },
        }),
        buildDescriptionField({
          id: 'photoDescription',
        }),
      ],
    }),
  ],
})
