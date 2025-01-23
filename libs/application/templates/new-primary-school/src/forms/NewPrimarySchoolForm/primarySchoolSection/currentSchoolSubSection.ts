import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  coreMessages,
} from '@island.is/application/core'
import { Application, NO } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getCurrentSchoolName,
} from '../../../lib/newPrimarySchoolUtils'

export const currentSchoolSubSection = buildSubSection({
  id: 'currentSchoolSubSection',
  title: newPrimarySchoolMessages.primarySchool.currentSchoolSubSectionTitle,
  condition: (answers) => {
    const { applyForNeighbourhoodSchool } = getApplicationAnswers(answers)
    return applyForNeighbourhoodSchool === NO
  },
  children: [
    buildMultiField({
      id: 'currentSchool',
      title:
        newPrimarySchoolMessages.primarySchool.currentSchoolSubSectionTitle,
      children: [
        buildDescriptionField({
          id: 'currentSchool.description',
          title: newPrimarySchoolMessages.primarySchool.currentSchoolInfo,
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
        buildCustomField({
          id: 'currentSchool.grade',
          title: newPrimarySchoolMessages.primarySchool.grade,
          width: 'half',
          disabled: true,
          component: 'Grade',
        }),
      ],
    }),
  ],
})
