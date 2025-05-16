import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

export const roleSection = buildSection({
  id: 'infoSection',
  title: 'Roles',
  children: [
    buildMultiField({
      id: 'procureFields',
      title: 'Roles',
      children: [
        buildDescriptionField({
          id: 'procureDescription2',
          title: 'Applicant',
          titleVariant: 'h4',
          description:
            'Applicant is the nationalID that is filling out the application',
        }),
        buildDescriptionField({
          id: 'procureDescription3',
          title: 'Actor',
          titleVariant: 'h4',
          description:
            'Actor is the nationalID of the person that is filling out the application on behalf of the applicant. Companies can not be actors, we have to be able to figure out which person filed the application.',
        }),
        buildDescriptionField({
          id: 'procureDescription4',
          title: 'Assignee',
          titleVariant: 'h4',
          description:
            'NationalID that is assigned to the application. This can be to view, edit or review the application. Assignees are covered better in the *example-state-transfers* application.',
        }),
      ],
    }),
  ],
})
