import {
  buildMultiField,
  buildCheckboxField,
  buildCustomField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
  buildDescriptionField,
  NO,
  YES,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { License } from '../../lib/constants'
import {
  hasNoDrivingLicenseInOtherCountry,
  isApplicationForCondition,
  isVisible,
} from '../../lib/utils/formUtils'

export const subSectionQualityPhoto = buildSubSection({
  id: 'photoStep',
  title: m.applicationQualityPhotoTitle,
  condition: isVisible(
    isApplicationForCondition([License.B_FULL, License.B_FULL_RENEWAL_65]),
    hasNoDrivingLicenseInOtherCountry,
  ),
  children: [
    buildMultiField({
      id: 'info',
      title: m.qualityPhotoTitle,
      condition: (_, externalData) => {
        return (
          getValueViaPath<{ data: { hasQualityPhoto: boolean } }>(
            externalData,
            'qualityPhoto',
          )?.data?.hasQualityPhoto === true
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
          title: '',
          disabled: false,
          options: [
            { value: NO, label: m.qualityPhotoNoAcknowledgement },
            { value: YES, label: m.qualityPhotoAcknowledgement },
          ],
        }),
        buildDescriptionField({
          id: 'photodesc',
          title: '',
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
          getValueViaPath<{ data: { hasQualityPhoto: boolean } }>(
            externalData,
            'qualityPhoto',
          )?.data?.hasQualityPhoto === false
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
          title: '',
          description: m.qualityPhotoInstructionBullets,
        }),
        buildDescriptionField({
          id: 'space',
          title: '',
          space: 'containerGutter',
        }),
        buildCheckboxField({
          id: 'willBringQualityPhoto',
          title: '',
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
