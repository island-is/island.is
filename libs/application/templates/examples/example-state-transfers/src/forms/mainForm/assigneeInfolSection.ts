import {
  buildMultiField,
  buildNationalIdWithNameField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'

export const assigneeInfoSection = buildSection({
  id: 'email',
  title: 'Email',
  children: [
    buildMultiField({
      id: 'emailFields',
      title: 'Email',
      children: [
        buildTextField({
          id: 'email',
          title: 'Email',
          description: 'Fill in an email to reccive an application link',
        }),
        buildNationalIdWithNameField({
          condition: (answers) => {
            console.log('answers: ', answers)

            return true
          },
          id: 'assigneeNationalIdWithName',
          title: 'assignee nationalId',
          description:
            'F.ex: The nationalId for Gervimaður Útlönd is 010130-7789',
        }),
      ],
    }),
  ],
})
