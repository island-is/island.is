import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const AssigneeApprovedForm = buildForm({
  id: 'ApprovedForm',
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
                'You approved the application and now it state transfered from the REVIEW state to the APPROVED state.',
            }),
            buildDescriptionField({
              id: 'approvedDescription2',
              description:
                'When entering this state, the method approveApplication in the template-api-module service was run. This is done through the onEntry property in the stateMachineConfig.states in the template.ts.',
            }),
            buildDescriptionField({
              id: 'approvedDescription3',
              description: m.hnippNote,
            }),
            buildDescriptionField({
              id: 'approvedDescription4',
              description: m.deadEnd,
            }),
          ],
        }),
      ],
    }),
  ],
})
