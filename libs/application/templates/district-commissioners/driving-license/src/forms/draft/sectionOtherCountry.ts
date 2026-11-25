import {
  buildMultiField,
  buildCheckboxField,
  buildRadioField,
  buildSubmitField,
  buildSection,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { DefaultEvents, FormValue } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { B_TEMP } from '../../utils/constants'

import { isApplicationForCondition } from '../../utils'

// Whether the applicant holds a foreign license — they can't apply online, so
// the footer button rejects them into the DECLINED state.
const hasForeignLicense = (answers: FormValue) =>
  getValueViaPath(answers, 'otherCountry.drivingLicenseInOtherCountry') === YES

export const sectionOtherCountry = buildSection({
  id: 'otherCountry',
  title: m.foreignDrivingLicense,
  condition: isApplicationForCondition(B_TEMP),
  children: [
    buildMultiField({
      id: 'info',
      title: m.foreignDrivingLicense,
      description: m.drivingLicenseInOtherCountry,
      children: [
        buildRadioField({
          id: 'otherCountry.drivingLicenseInOtherCountry',
          backgroundColor: 'blue',
          width: 'half',
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
          id: 'otherCountry.drivingLicenseDeprivedOrRestrictedInOtherCountry',
          backgroundColor: 'blue',
          condition: hasForeignLicense,
          options: [
            {
              value: NO,
              label: m.noDeprivedDrivingLicenseInOtherCountryTitle,
              subLabel: m.noDeprivedDrivingLicenseInOtherCountryDescription,
            },
          ],
        }),
        // Holding a foreign license can't be handled online — reject into the
        // DECLINED state (which explains the EES / non-EES next steps). Shown
        // only when the applicant answered "yes"; otherwise the footer proceeds
        // to the next step as usual.
        buildSubmitField({
          id: 'declineForeignLicense',
          placement: 'footer',
          // Refetch after submit so the applicant is taken straight to the
          // DECLINED state's reject screen once the transition completes.
          refetchApplicationAfterSubmit: true,
          condition: hasForeignLicense,
          actions: [
            {
              event: DefaultEvents.REJECT,
              name: m.continue,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
