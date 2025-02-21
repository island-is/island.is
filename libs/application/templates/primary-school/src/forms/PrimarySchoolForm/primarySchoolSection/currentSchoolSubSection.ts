import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  coreMessages,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { ApplicationType } from '../../../lib/constants'
import { primarySchoolMessages } from '../../../lib/messages'
import {
  formatGrade,
  getApplicationAnswers,
  getApplicationExternalData,
  getCurrentSchoolName,
} from '../../../lib/primarySchoolUtils'

export const currentSchoolSubSection = buildSubSection({
  id: 'currentSchoolSubSection',
  title: primarySchoolMessages.primarySchool.currentSchoolSubSectionTitle,
  condition: (answers) => {
    // Only display section if application type is "Application for a primary school"
    const { applicationType } = getApplicationAnswers(answers)
    return applicationType === ApplicationType.PRIMARY_SCHOOL
  },
  children: [
    buildMultiField({
      id: 'currentSchool',
      title: primarySchoolMessages.primarySchool.currentSchoolSubSectionTitle,
      children: [
        buildDescriptionField({
          id: 'currentSchool.description',
          title: primarySchoolMessages.primarySchool.currentSchool,
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'currentSchool.name',
          title: coreMessages.name,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getCurrentSchoolName(application),
        }),
        buildCustomField(
          {
            id: 'currentSchool.grade',
            title: primarySchoolMessages.primarySchool.grade,
            width: 'half',
            component: 'DynamicDisabledText',
          },
          {
            value: (application: Application, lang: Locale) => {
              const { childGradeLevel } = getApplicationExternalData(
                application.externalData,
              )
              return {
                ...primarySchoolMessages.primarySchool.currentGrade,
                values: {
                  grade: formatGrade(childGradeLevel, lang),
                },
              }
            },
          },
        ),
      ],
    }),
  ],
})
