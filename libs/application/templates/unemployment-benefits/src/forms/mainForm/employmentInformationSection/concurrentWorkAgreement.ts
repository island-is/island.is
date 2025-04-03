import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { employment as employmentMessages } from '../../../lib/messages'

export const concurrentWorkAgreementSubSection = buildSubSection({
  id: 'concurrentWorkAgreementSubSection',
  title: 'concurrentWorkAgreementSubSection',
  children: [
    buildMultiField({
      id: 'concurrentWorkAgreementSubSection',
      title: employmentMessages.concurrentWorkAgreement.pageTitle,
      description: employmentMessages.concurrentWorkAgreement.pageDescription,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
