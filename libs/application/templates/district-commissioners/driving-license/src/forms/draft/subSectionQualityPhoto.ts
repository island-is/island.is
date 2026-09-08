import {
  buildMultiField,
  buildCheckboxField,
  buildRadioField,
  buildSubSection,
  buildImageField,
  buildAlertMessageField,
  getValueViaPath,
  buildDescriptionField,
  toBase64DataUrl,
  YES,
  NO,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { B_FULL, B_FULL_RENEWAL_65 } from '../../utils/constants'
import {
  hasNoDrivingLicenseInOtherCountry,
  hasUsableRlsQualityPhoto,
  isApplicationForCondition,
  isVisible,
} from '../../utils'

export const subSectionQualityPhoto = buildSubSection({
  id: 'photoStep',
  title: m.applicationQualityPhotoTitle,
  condition: isVisible((answers) => {
    const matchesType = isApplicationForCondition([B_FULL, B_FULL_RENEWAL_65])(
      answers,
    )
    if (!matchesType) return false
    // When a redesign flag is on, the new photoStep* subsection takes over for
    // that product — suppress this old subsection for those cases.
    const isRedesigned65 =
      answers.applicationFor === B_FULL_RENEWAL_65 &&
      getValueViaPath(answers, 'is65RenewalRedesignEnabled') === true
    const isRedesignedBFull =
      answers.applicationFor === B_FULL &&
      getValueViaPath(answers, 'isBFullRedesignEnabled') === true
    return !isRedesigned65 && !isRedesignedBFull
  }, hasNoDrivingLicenseInOtherCountry),
  children: [
    // Has a usable quality photo in the license registry. The photo comes from
    // the `QualityPhotoAndSignatureApi` data provider (fetched in the external-
    // data step), so there is no mid-flow query here.
    buildMultiField({
      id: 'info',
      title: m.qualityPhotoTitle,
      condition: (_answers, externalData) =>
        hasUsableRlsQualityPhoto(externalData),
      children: [
        buildDescriptionField({
          id: 'qualityPhotoSubTitle',
          description: m.qualityPhotoSubTitle,
          marginBottom: 2,
        }),
        buildRadioField({
          id: 'willBringQualityPhoto',
          // The current photo is shown as the illustration on the "use current
          // photo" option. `buildImageField` resolves its image at build time,
          // so it must be built here inside the per-application options function.
          options: ({ externalData }) => {
            const photoAndSignature = getValueViaPath<{
              pohto?: string | null
            }>(externalData, 'qualityPhotoAndSignature.data')

            return [
              {
                value: NO,
                label: m.qualityPhotoNoAcknowledgement,
                illustration: buildImageField({
                  id: 'qualityPhoto-illustration',
                  image: toBase64DataUrl(photoAndSignature?.pohto ?? undefined),
                }),
              },
              { value: YES, label: m.qualityPhotoAcknowledgement },
            ]
          },
        }),
        buildDescriptionField({
          id: 'photodesc',
          description: m.qualityPhotoInstructionBullets,
          condition: (answers) =>
            getValueViaPath(answers, 'willBringQualityPhoto') === YES,
        }),
      ],
    }),
    // No usable quality photo — warn and require the applicant to acknowledge
    // they will bring a new one.
    buildMultiField({
      id: 'info',
      title: m.qualityPhotoTitle,
      condition: (_answers, externalData) =>
        !hasUsableRlsQualityPhoto(externalData),
      children: [
        buildAlertMessageField({
          id: 'qualityPhotoWarning',
          alertType: 'warning',
          title: m.qualityPhotoWarningTitle,
          message: m.qualityPhotoWarningDescription,
        }),
        buildDescriptionField({
          id: 'photodesc',
          description: m.qualityPhotoInstructionBullets,
        }),
        buildDescriptionField({
          id: 'space',
          space: 'containerGutter',
        }),
        buildCheckboxField({
          id: 'willBringQualityPhoto',
          options: [
            {
              value: YES,
              label: m.qualityPhotoAcknowledgement,
            },
          ],
        }),
      ],
    }),
  ],
})
