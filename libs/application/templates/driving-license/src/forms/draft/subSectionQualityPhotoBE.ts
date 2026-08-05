import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { BE } from '../../lib/constants'
import {
  hasNoDrivingLicenseInOtherCountry,
  hasUsableRlsQualityPhoto,
  isVisible,
} from '../../lib/utils'
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

            // Quality photo from getqualityphotoandsignature. The binary
            // (`pohto`) may be null for legacy records — createPhotoComponent
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
                illustration: createPhotoComponent(
                  photoAndSig?.pohto ?? undefined,
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
