import {
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  buildDescriptionField,
} from '@island.is/application/core'
import { memmMessages } from '../../../../lib/messages'
import {
  isDayCareProvider,
  isSchoolType,
} from '../../../../utils/conditionUtils'

export const educationSubSection = buildSubSection({
  id: 'memmEducationSubSection',
  title: memmMessages.education.subSectionTitle,
  children: [
    buildMultiField({
      id: 'memm.education',
      title: memmMessages.shared.pageTitle,
      description: memmMessages.shared.pageDescription,
      children: [
        buildDescriptionField({
          id: 'memm.education.heading',
          title: memmMessages.education.title,
          description: memmMessages.education.description,
          titleVariant: 'h3',
          space: 0,
        }),
        buildSelectField({
          id: 'memm.education.type',
          title: memmMessages.education.typeLabel,
          placeholder: memmMessages.education.typePlaceholder,
          doesNotRequireAnswer: true,
          // TODO: replace with school list dropdown from API when available
          options: [
            {
              value: 'kindergarten',
              label: memmMessages.education.typeKindergarten,
            },
            {
              value: 'elementarySchool',
              label: memmMessages.education.typeElementarySchool,
            },
            {
              value: 'highSchool',
              label: memmMessages.education.typeHighSchool,
            },
            {
              value: 'daycareProvider',
              label: memmMessages.education.typeDaycareProvider,
            },
          ],
        }),
        buildTextField({
          id: 'memm.education.schoolName',
          title: memmMessages.education.schoolName,
          doesNotRequireAnswer: true,
          condition: isSchoolType,
        }),
        buildTextField({
          id: 'memm.education.caregiverName',
          title: memmMessages.education.caregiverName,
          doesNotRequireAnswer: true,
          condition: isDayCareProvider,
        }),
      ],
    }),
  ],
})
