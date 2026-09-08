import {
  buildAlertMessageField,
  buildDescriptionField,
  buildImageField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
  toBase64DataUrl,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { requirementsMessages, m } from '../../lib/messages'
import { DrivingLicenseApplicationFor } from '../../utils/constants'
import { ConditionFn } from '../../types'
import {
  hasNoDrivingLicenseInOtherCountry,
  hasUsableRlsQualityPhoto,
  isVisible,
} from '../../utils'

export interface ThjodskraImage {
  biometricId: string
  content: string
  contentSpecification: string
}

export interface PhotoSelectorSubSectionOptions {
  // Unique sub-section id (e.g. 'photoStep65'). Kept per-product so form-node
  // ids stay stable and in-flight drafts are unaffected.
  id: string
  // The product this photo step belongs to.
  applicationFor: DrivingLicenseApplicationFor
  // Whether to show the "no usable photo" warning banner.
  withNoPhotoAlert: boolean
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

/**
 * Shared builder for the photo-selection step. 65+, B-temp and B-full all render
 * byte-identical pickers (Þjóðskrá facial photo + RLS quality photo), differing
 * only in id, product and whether the warning banner shows. Collapsing them here
 * means the photo-resolution logic lives in one place.
 */
export const buildPhotoSelectorSubSection = ({
  id,
  applicationFor,
  withNoPhotoAlert,
}: PhotoSelectorSubSectionOptions) => {
  const conditions: ConditionFn[] = [
    (answers) => answers.applicationFor === applicationFor,
    hasNoDrivingLicenseInOtherCountry,
  ]

  return buildSubSection({
    id,
    title: m.photoSelectionTitle,
    condition: isVisible(...conditions),
    children: [
      buildMultiField({
        id: 'selectPhoto',
        title: m.photoSelectionTitle,
        description: m.photoSelectionDescription,
        children: [
          ...(withNoPhotoAlert
            ? [
                buildAlertMessageField({
                  id: 'noUsablePhotoAlert',
                  title: requirementsMessages.beLicenseQualityPhotoTitle,
                  message:
                    requirementsMessages.beLicenseQualityPhotoDescription,
                  alertType: 'warning',
                  condition: (_answers, externalData) => {
                    const hasThjodskraFacial =
                      getFacialPhotos(externalData).length > 0

                    return (
                      !hasThjodskraFacial &&
                      !hasUsableRlsQualityPhoto(externalData)
                    )
                  },
                }),
              ]
            : []),
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
}
