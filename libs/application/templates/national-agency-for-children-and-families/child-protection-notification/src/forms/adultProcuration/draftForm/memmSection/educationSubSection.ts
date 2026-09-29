import {
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  coreMessages,
} from '@island.is/application/core'
import { memmMessages } from '../../../../lib/messages'
import {
  isDayCareProvider,
  isSchoolType,
} from '../../../../utils/conditionUtils'
import { getApplicationAnswers } from '../../../../utils/getApplicationAnswers'
import { getApplicationExternalData } from '../../../../utils/getApplicationExternalData'

export const educationSubSection = buildSubSection({
  id: 'memmEducationSubSection',
  title: memmMessages.education.subSectionTitle,
  children: [
    buildMultiField({
      id: 'memm.education',
      title: memmMessages.shared.pageTitle,
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
          options: ({ externalData }) => {
            const { schoolTypes } = getApplicationExternalData(externalData)
            return schoolTypes.map((r) => ({
              value: r.value ?? '',
              label: r.label ?? '',
            }))
          },
        }),
        buildTextField({
          id: 'memm.education.schoolName',
          title: memmMessages.education.schoolName,
          doesNotRequireAnswer: true,
          condition: (answers) =>
            isSchoolType(getApplicationAnswers(answers).memmEducationType),
        }),
        buildTextField({
          id: 'memm.education.caregiverName',
          title: coreMessages.name,
          doesNotRequireAnswer: true,
          condition: (answers) =>
            isDayCareProvider(getApplicationAnswers(answers).memmEducationType),
        }),
      ],
    }),
  ],
})
