import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const ApplicantApprovedForm = buildForm({
  id: 'ApplicantApprovedForm',
  children: [
    buildSection({
      id: 'approvedSection',
      tabTitle: 'Approved',
      children: [
        buildMultiField({
          id: 'approvedMultiField',
          title: 'Approved',
          children: [
            buildDescriptionField({
              id: 'approvedDescription',
              description:
                'This application was approved by the person you assigned the application to',
            }),
            buildDescriptionField({
              id: 'approvedDescription2',
              description: 'The application is now in the APPROVED state.',
            }),
            buildDescriptionField({
              id: 'approvedDescription3',
              description: m.deadEnd,
            }),
          ],
        }),
      ],
    }),
  ],
})
