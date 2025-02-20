import {
  buildMultiField,
  buildCheckboxField,
  buildCustomField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
  buildDescriptionField,
  YES,
  NO,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { HasQualityPhotoData } from '../../lib/types'
import { B_FULL, B_FULL_RENEWAL_65 } from '../../lib/constants'
import {
  hasNoDrivingLicenseInOtherCountry,
  isApplicationForCondition,
  isVisible,
} from '../../lib/utils'

export const subSectionQualityPhoto = buildSubSection({
  id: 'photoStep',
  title: m.applicationQualityPhotoTitle,
  condition: isVisible(
    isApplicationForCondition([B_FULL, B_FULL_RENEWAL_65]),
    hasNoDrivingLicenseInOtherCountry,
  ),
  children: [
    buildMultiField({
      id: 'info',
      title: m.qualityPhotoTitle,
      condition: (_, externalData) => {
        return (
          getValueViaPath<HasQualityPhotoData>(externalData, 'qualityPhoto')
            ?.data?.hasQualityPhoto === true
        )
      },
      children: [
        buildCustomField({
          title: m.eligibilityRequirementTitle,
          component: 'QualityPhoto',
          id: 'qphoto',
        }),
        buildRadioField({
          id: 'willBringQualityPhoto',
          disabled: false,
          options: [
            { value: NO, label: m.qualityPhotoNoAcknowledgement },
            { value: YES, label: m.qualityPhotoAcknowledgement },
          ],
        }),
        buildDescriptionField({
          id: 'photodesc',
          description: m.qualityPhotoInstructionBullets,
          condition: (answers) =>
            getValueViaPath(answers, 'willBringQualityPhoto') === YES,
        }),
      ],
    }),
    buildMultiField({
      id: 'info',
      title: m.qualityPhotoTitle,
      condition: (_, externalData) => {
        return (
          getValueViaPath<HasQualityPhotoData>(externalData, 'qualityPhoto')
            ?.data?.hasQualityPhoto === false
        )
      },
      children: [
        buildCustomField({
          title: m.eligibilityRequirementTitle,
          component: 'QualityPhoto',
          id: 'qphoto',
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
