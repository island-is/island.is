import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, Condition } from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'
import { m, requirementsMessages } from '../../../lib/messages'
import { QUALITY_IMAGE_TYPE_IDS } from '../../../lib/constants'
import { createPhotoComponent } from '../../../fields/CreatePhoto'

interface ThjodskraImage {
  biometricId: string
  content: string
  contentSpecification: string
}

interface Args {
  id: string
  title: MessageDescriptor
  condition: Condition
  // BE's existing flow does not render the empty-state alert (its eligibility
  // step blocks earlier so the alert was never needed). Keep the default off
  // so callers opt in explicitly — extending the alert to BE would be a
  // behavior change.
  showEmptyStateAlert?: boolean
}

export const buildPhotoSelectionSubSection = ({
  id,
  title,
  condition,
  showEmptyStateAlert = false,
}: Args) =>
  buildSubSection({
    id,
    title,
    condition,
    children: [
      buildMultiField({
        id: 'selectPhoto',
        title,
        description: m.photoSelectionDescription,
        children: [
          ...(showEmptyStateAlert
            ? [
                buildAlertMessageField({
                  id: 'noUsablePhotoAlert',
                  title: requirementsMessages.beLicenseQualityPhotoTitle,
                  message:
                    requirementsMessages.beLicenseQualityPhotoDescription,
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
                      QUALITY_IMAGE_TYPE_IDS.includes(
                        photoAndSig?.imageTypeId ?? 0,
                      )

                    return !hasThjodskraFacial && !hasQualityPhoto
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
                illustration?: ReturnType<typeof createPhotoComponent>
              }> = []

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
