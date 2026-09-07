import {
  buildMultiField,
  buildKeyValueField,
  buildDividerField,
  buildSection,
} from '@island.is/application/core'
import { applicantInformationArray } from '@island.is/application/ui-forms'
import { m } from '../../../lib/messages'
import { BE, B_ADVANCED } from '../../../utils'

export const sectionApplicantInfo = buildSection({
  id: 'infoStep',
  title: m.informationApplicant,
  children: [
    buildMultiField({
      id: 'info',
      title: m.informationApplicant,
      description: m.informationApplicantDescription,
      space: 2,
      children: [
        buildDividerField({}),
        // Application-specific row on top of the shared applicant fields:
        buildKeyValueField({
          label: m.drivingLicenseTypeRequested,
          value: m.applicationForBELicenseTitle,
          condition: (answers) => answers.applicationFor === BE,
        }),
        buildKeyValueField({
          label: m.drivingLicenseTypeRequested,
          value: m.applicationForBAdvancedDescription,
          condition: (answers) => answers.applicationFor === B_ADVANCED,
        }),
        ...applicantInformationArray({ phoneRequired: true }),
      ],
    }),
  ],
})
