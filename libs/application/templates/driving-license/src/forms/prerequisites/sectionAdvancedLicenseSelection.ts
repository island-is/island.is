import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { License } from '../../lib/constants'

export const sectionAdvancedLicenseSelection = buildSubSection({
  id: 'sectionAdvancedLicenseSelection',
  title: m.applicationForAdvancedLicenseTitle,
  condition: (answers) => {
    const applicationFor = getValueViaPath<string>(answers, 'applicationFor')

    return applicationFor != null && applicationFor === License.B_ADVANCED
  },
  children: [
    buildMultiField({
      id: 'advancedLicenseSelectionFields',
      title: m.applicationForAdvancedLicenseSectionTitle,
      description: m.applicationForAdvancedLicenseSectionDescription,
      children: [
        buildCustomField({
          id: 'advancedLicense',
          title: '',
          component: 'AdvancedLicenseSelection',
        }),
      ],
    }),
  ],
})
