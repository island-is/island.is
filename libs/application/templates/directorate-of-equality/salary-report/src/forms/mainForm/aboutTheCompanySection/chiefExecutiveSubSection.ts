import {
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'
import { ChiefExecutiveGender } from '../../../utils/types'

export const chiefExecutiveSubSection = buildSubSection({
  id: 'chiefExecutive',
  title: messages.aboutTheCompany.chiefExecutive.sectionTitle,
  children: [
    buildMultiField({
      id: 'chiefExecutiveMultiField',
      title: messages.aboutTheCompany.chiefExecutive.title,
      description: messages.aboutTheCompany.chiefExecutive.intro,
      children: [
        buildTextField({
          id: 'chiefExecutive.name',
          title: messages.aboutTheCompany.chiefExecutive.name,
          placeholder: messages.aboutTheCompany.chiefExecutive.namePlaceholder,
          width: 'full',
          required: true,
        }),
        buildTextField({
          id: 'chiefExecutive.email',
          title: messages.aboutTheCompany.chiefExecutive.email,
          placeholder: messages.aboutTheCompany.chiefExecutive.emailPlaceholder,
          width: 'full',
          variant: 'email',
          required: true,
        }),
        buildSelectField({
          id: 'chiefExecutive.gender',
          title: messages.aboutTheCompany.chiefExecutive.gender,
          width: 'half',
          required: true,
          options: [
            {
              value: ChiefExecutiveGender.MALE,
              label: messages.aboutTheCompany.chiefExecutive.genderMale,
            },
            {
              value: ChiefExecutiveGender.FEMALE,
              label: messages.aboutTheCompany.chiefExecutive.genderFemale,
            },
            {
              value: ChiefExecutiveGender.NON_BINARY,
              label: messages.aboutTheCompany.chiefExecutive.genderNonBinary,
            },
          ],
        }),
      ],
    }),
  ],
})
