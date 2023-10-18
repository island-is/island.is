import {
  buildMultiField,
  buildCheckboxField,
  buildCustomField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
  hasYes,
  buildDescriptionField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { HasQualityPhotoData } from '../../lib/types'
import { NO, YES, B_FULL, B_FULL_RENEWAL_65 } from '../../lib/constants'

export const subSectionQualityPhoto = buildSubSection({
  id: 'photoStep',
  title: m.applicationQualityPhotoTitle,
  condition: (answers) => {
    return (
      (answers.applicationFor === B_FULL ||
        answers.applicationFor === B_FULL_RENEWAL_65) &&
      !hasYes(answers?.drivingLicenseInOtherCountry)
    )
  },
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
          title: '',
          disabled: false,
          options: [
            { value: NO, label: m.qualityPhotoNoAcknowledgement },
            { value: YES, label: m.qualityPhotoAcknowledgement },
          ],
        }),
        buildCustomField({
          id: 'photdesc',
          title: '',
          component: 'Bullets',
          condition: (answers) => hasYes(answers.willBringQualityPhoto),
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
        buildCustomField({
          id: 'photodescription',
          title: '',
          component: 'Bullets',
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
