import {
  buildMultiField,
  buildTextField,
  buildSection,
  buildPhoneField,
} from '@island.is/application/core'
import { assigneeInformation } from '../../lib/messages'

export const assigneeInformationSection = buildSection({
  id: 'assigneeInformationSection',
  title: assigneeInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'assigneeInformationMultiField',
      title: assigneeInformation.general.title,
      description: assigneeInformation.general.description,
      children: [
        buildTextField({
          id: 'assigneeInformation.companyNationalId',
          title: assigneeInformation.labels.companyNationalId,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'assigneeInformation.companyName',
          title: assigneeInformation.labels.companyName,
          width: 'half',
          format: '######-####',
          required: true,
        }),
        buildTextField({
          id: 'assigneeInformation.assigneeName',
          title: assigneeInformation.labels.assigneeName,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'assigneeInformation.assigneeNationalId',
          title: assigneeInformation.labels.assigneeNationalId,
          width: 'half',
          format: '######-####',
          required: true,
        }),
        buildTextField({
          id: 'assigneeInformation.assigneeEmail',
          title: assigneeInformation.labels.assigneeEmail,
          width: 'half',
          required: true,
        }),
        buildPhoneField({
          id: 'assigneeInformation.assigneePhone',
          title: assigneeInformation.labels.assigneePhone,
          width: 'half',
          required: true,
        }),
      ],
    }),
  ],
})
