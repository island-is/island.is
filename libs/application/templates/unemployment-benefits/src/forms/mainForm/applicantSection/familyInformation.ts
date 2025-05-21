import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildRepeater,
  buildSubSection,
} from '@island.is/application/core'
import { applicant as applicantMessages } from '../../../lib/messages'
import { Application } from '@island.is/application/types'

export const familyInformationSubSection = buildSubSection({
  id: 'familyInformationSubSection',
  title: applicantMessages.familyInformation.sectionTitle,
  children: [
    buildMultiField({
      id: 'familyInformationSubSection',
      title: applicantMessages.familyInformation.pageTitle,
      children: [
        buildFieldsRepeaterField({
          id: 'familyInformation.children',
          minRows: 2,
          fields: {
            name: {
              label: 'Nafn barns',
              type: 'text',
              readonly: true,
              component: 'input',
            },
            nationalId: {
              label: 'Kennitala barns',
              type: 'text',
              readonly: true,
              component: 'input',
            },
          },
        }),
      ],
    }),
  ],
})
