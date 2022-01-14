import {
  buildMultiField,
  buildCheckboxField,
  buildCustomField,
  buildRadioField,
  FormValue,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { QualityPhotoData } from '../../lib/types'
import { NO, YES } from '../../lib/constants'
import { B_FULL } from '../../shared/constants'
import {
  hasNoDrivingLicenseInOtherCountry,
  hasYes,
  isApplicationForCondition,
  isVisible,
} from '../../lib/utils'

export const subSectionQualityPhoto = buildSubSection({
  id: 'photoStep',
  title: m.applicationQualityPhotoTitle,
  condition: isVisible(
    isApplicationForCondition(B_FULL),
    hasNoDrivingLicenseInOtherCountry,
  ),
  children: [
    buildMultiField({
      id: 'info',
      title: m.qualityPhotoTitle,
      condition: (_, externalData) => {
        return (
          (externalData.qualityPhoto as QualityPhotoData)?.data?.success ===
          true
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
      condition: (answers: FormValue, externalData) => {
        return (
          (externalData.qualityPhoto as QualityPhotoData)?.data?.success ===
          false
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
