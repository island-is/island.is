import {
  buildAlertMessageField,
  buildDescriptionField,
  buildImageField,
  buildMultiField,
  buildRadioField,
  buildSection,
  getValueViaPath,
  toBase64DataUrl,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { requirementsMessages, m } from '../../lib/messages'
import {
  hasNoDrivingLicenseInOtherCountry,
  hasUsableRlsQualityPhoto,
} from '../../utils'

export interface ThjodskraImage {
  biometricId: string
  content: string
  contentSpecification: string
}

// The Þjóðskrá facial photos a person can pick from. Read in three places
// below (banner, default value, options) — keep the path and the FACIAL
// filter in one spot so they cannot drift apart.
const getFacialPhotos = (externalData: Application['externalData']) =>
  (
    getValueViaPath<ThjodskraImage[]>(
      externalData,
      'allPhotosFromThjodskra.data.images',
    ) ?? []
  ).filter((p) => p.contentSpecification === 'FACIAL')

// Photo-selection step. Every license type (65+, B-temp, B-full) renders the
// same picker (Þjóðskrá facial photo + RLS quality photo) and writes the same
// `selectLicensePhoto` answer, so there is a single step for all of them.
export const sectionPhoto = buildSection({
  id: 'photo',
  title: m.photoSelectionTitle,
  condition: hasNoDrivingLicenseInOtherCountry,
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
            const hasThjodskraFacial = getFacialPhotos(externalData).length > 0

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

            const facialPhotos = getFacialPhotos(externalData)

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
            for (const photo of getFacialPhotos(externalData)) {
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
