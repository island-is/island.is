import {
  buildCheckboxField,
  buildMultiField,
  buildSubSection,
  YES,
} from '@island.is/application/core'
import {
  employment as employmentMessages,
  application as applicationMessages,
} from '../../../lib/messages'

export const concurrentWorkAgreementSubSection = buildSubSection({
  id: 'concurrentWorkAgreementSubSection',
  title: employmentMessages.concurrentWorkAgreement.sectionTitle,
  children: [
    buildMultiField({
      id: 'concurrentWorkAgreementSubSection',
      title: employmentMessages.concurrentWorkAgreement.pageTitle,
      description: employmentMessages.concurrentWorkAgreement.pageDescription,
      children: [
        buildCheckboxField({
          id: 'concurrentWorkAgreement',
          backgroundColor: 'blue',
          large: true,
          options: [
            {
              value: YES,
              label: applicationMessages.agreeCheckbox,
            },
          ],
        }),
      ],
    }),
  ],
})
