import {
  buildDescriptionField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildSection,
} from '@island.is/application/core'

export const assigneeInfoSection = buildSection({
  id: 'email',
  title: 'Assignee',
  children: [
    buildMultiField({
      id: 'emailFields',
      title: 'Assignee',
      children: [
        buildDescriptionField({
          id: 'assigneeInfoDescription',
          description: 'Pick an gervimaður to review the application',
        }),
        buildNationalIdWithNameField({
          id: 'assigneeNationalIdWithName',
          description:
            'F.ex: The nationalId for Gervimaður Útlönd is 010130-7789',
        }),
      ],
    }),
  ],
})
