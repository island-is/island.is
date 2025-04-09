import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'

export const employmentSearchConfirmationAgreementSubSection = buildSubSection({
  id: 'employmentSearchConfirmationAgreementSubSection',
  title:
    employmentSearchMessages.employmentSearchConfirmationAgreement.sectionTitle,
  children: [
    buildMultiField({
      id: 'employmentSearchConfirmationAgreementSubSection',
      title:
        employmentSearchMessages.employmentSearchConfirmationAgreement
          .pageTitle,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
