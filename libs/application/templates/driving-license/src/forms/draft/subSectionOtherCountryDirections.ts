import { buildCustomField, buildSubSection } from '@island.is/application/core'
import { hasYes } from '../../lib/utils'

export const subSectionOtherCountryDirections = buildSubSection({
  id: 'otherCountrySelected',
  title: 'Leiðbeiningar',
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
