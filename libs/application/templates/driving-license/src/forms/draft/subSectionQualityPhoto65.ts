import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { requirementsMessages, m } from '../../lib/messages'
import { B_FULL_RENEWAL_65, QUALITY_IMAGE_TYPE_IDS } from '../../lib/constants'
import { hasNoDrivingLicenseInOtherCountry, isVisible } from '../../lib/utils'
import { createPhotoComponent } from '../../fields/CreatePhoto'

interface ThjodskraImage {
  biometricId: string
  content: string
  contentSpecification: string
}

export const subSectionQualityPhoto65 = buildSubSection({
  id: 'photoStep65',
  title: m.photoSelectionTitle,
  condition: isVisible(
    (answers) => answers.applicationFor === B_FULL_RENEWAL_65,
    (answers) =>
      getValueViaPath(answers, 'is65RenewalRedesignEnabled') === true,
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

            const photoAndSig = getValueViaPath<{
              imageTypeId?: number | null
              pohto?: string | null
            }>(externalData, 'qualityPhotoAndSignature.data')

            const hasQualityPhoto =
              !!photoAndSig?.pohto &&
              QUALITY_IMAGE_TYPE_IDS.includes(photoAndSig?.imageTypeId ?? 0)

            return !hasThjodskraFacial && !hasQualityPhoto
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

            // Pair with `selectLicensePhoto: z.string().min(1).optional()` in
            // dataSchema.ts: returning '' here (instead of undefined) makes
            // schema validation block Continue when no usable photo exists,
            // so the alert above is enforced rather than dismissable.
            return ''
          },
          options: ({ externalData }) => {
            const options: Array<{
              value: string
              label: typeof m.usePassportImage
              illustration?: ReturnType<typeof createPhotoComponent>
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
                illustration: createPhotoComponent(photo.content),
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
                illustration: createPhotoComponent(
                  photoAndSig.pohto ?? undefined,
                ),
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
