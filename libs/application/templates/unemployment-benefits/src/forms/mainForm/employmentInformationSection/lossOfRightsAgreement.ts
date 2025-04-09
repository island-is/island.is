import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { employment as employmentMessages } from '../../../lib/messages'

export const lossOfRightsAgreementSubSection = buildSubSection({
  id: 'lossOfRightsAgreementSubSection',
  title: employmentMessages.lossOfRightsAgreement.sectionTitle,
  children: [
    buildMultiField({
      id: 'lossOfRightsAgreementSubSection',
      title: employmentMessages.lossOfRightsAgreement.pageTitle,
      description: employmentMessages.lossOfRightsAgreement.pageDescription,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
