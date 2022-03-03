import {
  buildCheckboxField,
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  FormValue,
  getValueViaPath,
} from '@island.is/application/core'

import { NO, YES } from '../../lib/constants'
import { m } from '../../lib/messages'
import { HasQualityPhotoData } from '../../lib/types'
import {
  hasNoDrivingLicenseInOtherCountry,
  hasYes,
  isApplicationForCondition,
  isVisible,
} from '../../lib/utils'
import { B_FULL } from '../../shared/constants'

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
