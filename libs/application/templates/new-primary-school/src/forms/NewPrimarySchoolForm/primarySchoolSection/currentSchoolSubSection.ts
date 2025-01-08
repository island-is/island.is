import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  coreMessages,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getCurrentSchoolName } from '../../../lib/newPrimarySchoolUtils'
import { Application } from '@island.is/application/types'

export const currentSchoolSubSection = buildSubSection({
  id: 'currentSchoolSubSection',
  title: newPrimarySchoolMessages.primarySchool.currentSchoolSubSectionTitle,
  children: [
    buildMultiField({
      id: 'school',
      title:
        newPrimarySchoolMessages.primarySchool.currentSchoolSubSectionTitle,
      children: [
        buildDescriptionField({
          id: 'currentSchool',
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
        buildDescriptionField({
          id: 'supervisingTeacher',
          title: newPrimarySchoolMessages.primarySchool.supervisingTeacher,
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'supervisingTeacher.name',
          title: coreMessages.name,
          width: 'half',
          disabled: true,
          // TODO: Use correct value
          defaultValue: (application: Application) =>
            getCurrentSchoolName(application),
        }),
        buildTextField({
          id: 'supervisingTeacher.email',
          title: newPrimarySchoolMessages.shared.email,
          width: 'half',
          disabled: true,
          // TODO: Use correct value
          defaultValue: (application: Application) =>
            getCurrentSchoolName(application),
        }),
        buildDescriptionField({
          id: 'prosperityContact',
          title: newPrimarySchoolMessages.primarySchool.prosperityContact,
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'prosperityContact.name',
          title: coreMessages.name,
          width: 'half',
          disabled: true,
          // TODO: Use correct value
          defaultValue: (application: Application) =>
            getCurrentSchoolName(application),
        }),
        buildTextField({
          id: 'prosperityContact.email',
          title: newPrimarySchoolMessages.shared.email,
          width: 'half',
          disabled: true,
          // TODO: Use correct value
          defaultValue: (application: Application) =>
            getCurrentSchoolName(application),
        }),
        buildDescriptionField({
          id: 'caseManager',
          title: newPrimarySchoolMessages.primarySchool.caseManager,
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'caseManager.name',
          title: coreMessages.name,
          width: 'half',
          disabled: true,
          // TODO: Use correct value
          defaultValue: (application: Application) =>
            getCurrentSchoolName(application),
        }),
        buildTextField({
          id: 'caseManager.email',
          title: newPrimarySchoolMessages.shared.email,
          width: 'half',
          disabled: true,
          // TODO: Use correct value
          defaultValue: (application: Application) =>
            getCurrentSchoolName(application),
        }),
      ],
    }),
  ],
})
