import {
  buildCustomField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { LicenseTypes } from '../../../utils'

export const sectionAdvancedLicenseSelection = buildSection({
  id: 'sectionAdvancedLicenseSelection',
  title: m.applicationForAdvancedLicenseTitle,
  condition: (answers) => {
    const applicationFor = getValueViaPath<LicenseTypes>(
      answers,
      'applicationFor',
    )

    return applicationFor != null && applicationFor === LicenseTypes.B_ADVANCED
  },
  children: [
    buildMultiField({
      id: 'advancedLicenseSelectionFields',
      title: m.applicationForAdvancedLicenseSectionTitle,
      description: m.applicationForAdvancedLicenseSectionDescription,
      children: [
        buildCustomField({
          id: 'advancedLicense',
          component: 'AdvancedLicenseSelection',
        }),
      ],
    }),
  ],
})
