import {
  buildCheckboxField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'

import { NO, YES } from '../../lib/constants'
import { m } from '../../lib/messages'
import { hasYes, isApplicationForCondition } from '../../lib/utils'
import { B_TEMP } from '../../shared/constants'

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
          description: '',
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
