import {
  buildAlertMessageField,
  buildDescriptionField,
  buildImageField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { requirementsMessages, m } from '../../lib/messages'
import { B_TEMP } from '../../lib/constants'
import {
  hasNoDrivingLicenseInOtherCountry,
  hasUsableRlsQualityPhoto,
  isVisible,
  toBase64DataUrl,
} from '../../lib/utils'

interface ThjodskraImage {
  biometricId: string
  content: string
  contentSpecification: string
}

export const subSectionQualityPhotoTemp = buildSubSection({
  id: 'photoStepTemp',
  title: m.photoSelectionTitle,
  condition: isVisible(
    (answers) => answers.applicationFor === B_TEMP,
    (answers) => getValueViaPath(answers, 'isBTempRedesignEnabled') === true,
    hasNoDrivingLicenseInOtherCountry,
  ),
  children: [
    buildMultiField({
      id: 'selectPhoto',
      title: m.photoSelectionTitle,
      description: m.photoSelectionDescription,
      children: [
        buildAlertMessageField({
          id: 'noUsablePhotoAlert',
          title: requirementsMessages.beLicenseQualityPhotoTitle,
          message: requirementsMessages.beLicenseQualityPhotoDescription,
          alertType: 'warning',
          condition: (_answers, externalData) => {
            const thjodskraPhotos =
              getValueViaPath<ThjodskraImage[]>(
                externalData,
                'allPhotosFromThjodskra.data.images',
              ) ?? []
            const hasThjodskraFacial = thjodskraPhotos.some(
              (p) => p.contentSpecification === 'FACIAL',
            )

            return (
              !hasThjodskraFacial && !hasUsableRlsQualityPhoto(externalData)
            )
          },
        }),
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

            if (hasUsableRlsQualityPhoto(externalData)) {
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

            // Quality photo from getqualityphotoandsignature. The binary
            // (`pohto`) may be null for legacy records — toBase64DataUrl
            // falls back to a placeholder, and submission resolves the photo
            // by reference, so offer the option whenever a record exists.
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
          },
        }),
        buildDescriptionField({
          id: 'photoDescription',
        }),
      ],
    }),
  ],
})
