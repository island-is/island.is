import { buildCustomField, buildSubSection } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { hasYes } from '@island.is/application/core'

export const subSectionOtherCountryDirections = buildSubSection({
  id: 'otherCountrySelected',
  title: m.countryDirectionsTitle,
  condition: (answer) => hasYes(answer?.drivingLicenseInOtherCountry),
  children: [
    buildCustomField({
      condition: (answers) =>
        hasYes(answers?.drivingLicenseInOtherCountry || []),
      title: 'SubmitAndDecline',
      component: 'SubmitAndDecline',
      id: 'SubmitAndDecline',
    }),
  ],
})
