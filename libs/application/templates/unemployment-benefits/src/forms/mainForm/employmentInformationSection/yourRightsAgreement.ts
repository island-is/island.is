import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { employment as employmentMessages } from '../../../lib/messages'

export const yourRightsAgreementSubSection = buildSubSection({
  id: 'yourRightsAgreementSubSection',
  title: employmentMessages.yourRightsAgreement.sectionTitle,
  children: [
    buildMultiField({
      id: 'yourRightsAgreementSubSection',
      title: employmentMessages.yourRightsAgreement.pageTitle,
      description: employmentMessages.yourRightsAgreement.pageDescription,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
