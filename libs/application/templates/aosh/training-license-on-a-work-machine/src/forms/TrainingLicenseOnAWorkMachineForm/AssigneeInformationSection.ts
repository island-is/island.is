import {
  buildMultiField,
  buildTextField,
  buildSection,
  buildPhoneField,
  buildCheckboxField,
  YES,
  buildNationalIdWithNameField,
} from '@island.is/application/core'
import { assigneeInformation } from '../../lib/messages'
import { isContractor } from '../../utils'

export const assigneeInformationSection = buildSection({
  id: 'assigneeInformationSection',
  title: assigneeInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'assigneeInformationMultiField',
      title: assigneeInformation.general.title,
      description: assigneeInformation.general.description,
      children: [
        buildCheckboxField({
          id: 'assigneeInformation.isContractor',
          title: '',
          options: [
            {
              value: YES,
              label: assigneeInformation.labels.isContractor,
            },
          ],
        }),
        buildNationalIdWithNameField({
          id: 'assigneeInformation.company',
          title: '',
          customNationalIdLabel: assigneeInformation.labels.companyNationalId,
          customNameLabel: assigneeInformation.labels.companyName,
          searchCompanies: true,
          searchPersons: false,
          required: true,
          condition: (answers) => !isContractor(answers),
        }),
        buildNationalIdWithNameField({
          id: 'assigneeInformation.assignee',
          title: '',
          customNationalIdLabel: assigneeInformation.labels.assigneeNationalId,
          customNameLabel: assigneeInformation.labels.assigneeName,
          emailLabel: assigneeInformation.labels.assigneeEmail,
          phoneLabel: assigneeInformation.labels.assigneePhone,
          showEmailField: true,
          showPhoneField: true,
          emailRequired: true,
          phoneRequired: true,
          searchCompanies: false,
          searchPersons: true,
          required: true,
          condition: (answers) => !isContractor(answers),
        }),
      ],
    }),
  ],
})
