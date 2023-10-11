import {
  buildMultiField,
  buildCheckboxField,
  buildRadioField,
  buildSubSection,
  hasYes,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { NO, YES, B_TEMP } from '../../lib/constants'
import { isApplicationForCondition } from '../../lib/utils'

export const subSectionOtherCountry = buildSubSection({
  id: 'otherCountry',
  title: m.foreignDrivingLicense,
  condition: isApplicationForCondition(B_TEMP),
  children: [
    buildMultiField({
      id: 'info',
      title: m.drivingLicenseInOtherCountry,
      space: 1,
      children: [
        buildRadioField({
          id: 'drivingLicenseInOtherCountry',
          backgroundColor: 'white',
          title: '',
          width: 'half',
          space: 0,
          largeButtons: true,
          options: [
            {
              label: m.no,
              value: NO,
            },
            {
              label: m.yes,
              value: YES,
            },
          ],
        }),
        buildCheckboxField({
          id: 'drivingLicenseDeprivedOrRestrictedInOtherCountry',
          backgroundColor: 'white',
          title: '',
          condition: (answers) =>
            hasYes(answers?.drivingLicenseInOtherCountry || []),
          options: [
            {
              value: NO,
              label: m.noDeprivedDrivingLicenseInOtherCountryTitle,
              subLabel:
                m.noDeprivedDrivingLicenseInOtherCountryDescription
                  .defaultMessage,
            },
          ],
        }),
      ],
    }),
  ],
})
