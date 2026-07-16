import {
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'

export const employeeCountSubSection = buildSubSection({
  id: 'employeeCount',
  title: messages.aboutTheCompany.employeeCount.sectionTitle,
  children: [
    buildMultiField({
      id: 'employeeCountMultiField',
      title: messages.aboutTheCompany.employeeCount.title,
      description: messages.aboutTheCompany.employeeCount.intro,
      children: [
        buildTextField({
          id: 'employeeCount.women',
          title: messages.aboutTheCompany.employeeCount.women,
          width: 'half',
          variant: 'number',
          required: true,
        }),
        buildTextField({
          id: 'employeeCount.men',
          title: messages.aboutTheCompany.employeeCount.men,
          width: 'half',
          variant: 'number',
          required: true,
        }),
        buildTextField({
          id: 'employeeCount.nonBinary',
          title: messages.aboutTheCompany.employeeCount.nonBinary,
          width: 'half',
          variant: 'number',
          required: true,
        }),
      ],
    }),
  ],
})
