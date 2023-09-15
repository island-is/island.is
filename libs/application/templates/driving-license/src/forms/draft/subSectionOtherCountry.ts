import {
  buildMultiField,
  buildCheckboxField,
  buildRadioField,
  buildSubSection,
  hasYes,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { NO, YES } from '../../lib/constants'
import { B_TEMP } from '../../shared/constants'
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
              subLabel: '',
              value: NO,
            },
            {
              label: m.yes,
              subLabel: '',
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
