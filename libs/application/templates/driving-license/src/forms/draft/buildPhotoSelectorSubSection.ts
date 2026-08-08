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
import { DrivingLicenseApplicationFor } from '../../lib/constants'
import { ConditionFn } from '../../lib/types'
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

interface PhotoSelectorSubSectionOptions {
  // Unique sub-section id (e.g. 'photoStepBE'). Kept per-product so form-node
  // ids stay stable and in-flight drafts are unaffected.
  id: string
  // The product this photo step belongs to.
  applicationFor: DrivingLicenseApplicationFor
  // Redesign feature-flag answer key that must be `true` for this step to show.
  // Omit for products where the new selector is unconditional (BE). 65+ and
  // B-temp gate on their redesign flags, which are off in prod.
  redesignFlagKey?:
    | 'is65RenewalRedesignEnabled'
    | 'isBTempRedesignEnabled'
    | 'isBFullRedesignEnabled'
  // Whether to show the "no usable photo" warning banner. BE omits it.
  withNoPhotoAlert: boolean
}

/**
 * Shared builder for the redesign photo-selection step. BE, 65+, B-temp and
 * B-full all render byte-identical pickers (Þjóðskrá facial photo + RLS quality
 * photo), differing only in id, product, redesign-flag gate and whether the
 * warning banner shows. Collapsing them here means the photo-resolution logic
 * lives in one place.
 *
 * Note: this does not touch the legacy `subSectionQualityPhoto` step (the
 * `willBringQualityPhoto` flow), which remains the live path for B-full and for
 * 65+ when its redesign flag is off — it must keep working until every flag is on.
 */
export const buildPhotoSelectorSubSection = ({
  id,
  applicationFor,
  redesignFlagKey,
  withNoPhotoAlert,
}: PhotoSelectorSubSectionOptions) => {
  const conditions: ConditionFn[] = [
    (answers) => answers.applicationFor === applicationFor,
  ]
  if (redesignFlagKey) {
    conditions.push(
      (answers) => getValueViaPath(answers, redesignFlagKey) === true,
    )
  }
  conditions.push(hasNoDrivingLicenseInOtherCountry)

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
                    const thjodskraPhotos =
                      getValueViaPath<ThjodskraImage[]>(
                        externalData,
                        'allPhotosFromThjodskra.data.images',
                      ) ?? []
                    const hasThjodskraFacial = thjodskraPhotos.some(
                      (p) => p.contentSpecification === 'FACIAL',
                    )

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
}
