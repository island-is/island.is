import {
  buildCustomField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { YES } from '../../lib/constants'

export const subSectionOtherCountryDirections = buildSubSection({
  id: 'otherCountrySelected',
  title: m.countryDirectionsTitle,
  condition: (answers) =>
    getValueViaPath(answers, 'otherCountry.drivingLicenseInOtherCountry') ===
    YES,
  children: [
    buildCustomField({
      condition: (answers) =>
        getValueViaPath(
          answers,
          'otherCountry.drivingLicenseInOtherCountry',
        ) === YES,
      title: 'SubmitAndDecline',
      component: 'SubmitAndDecline',
      id: 'SubmitAndDecline',
    }),
  ],
})
