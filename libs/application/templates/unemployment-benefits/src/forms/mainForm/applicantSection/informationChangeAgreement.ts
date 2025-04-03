import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { applicant as applicantMessages } from '../../../lib/messages'

export const informationChangeAgreement = buildSubSection({
  id: 'informationChangeAgreement',
  title: 'informationChangeAgreement',
  children: [
    buildMultiField({
      id: 'informationChangeAgreement',
      title: applicantMessages.informationChangeAgreement.pageTitle,
      description: applicantMessages.informationChangeAgreement.pageDescription,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
