import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { BE, QUALITY_IMAGE_TYPE_IDS } from '../../lib/constants'
import { hasNoDrivingLicenseInOtherCountry, isVisible } from '../../lib/utils'
import { createPhotoComponent } from '../../fields/CreatePhoto'

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

            return undefined
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
