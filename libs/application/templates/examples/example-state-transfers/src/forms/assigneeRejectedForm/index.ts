import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const AssigneeRejectedForm = buildForm({
  id: 'RejectedForm',
  children: [
    buildSection({
      id: 'rejectedSection',
      tabTitle: 'Rejected',
      children: [
        buildMultiField({
          id: 'rejectedMultiField',
          title: 'Rejected',
          children: [
            buildDescriptionField({
              id: 'rejectedDescription',
              description:
                'You rejected the application and now it state transfered from the REVIEW state to the REJECTED state.',
            }),
            buildDescriptionField({
              id: 'rejectedDescription2',
              description:
                'When entering this state, the method rejectApplication in the template-api-module service was run. This is done through the onEntry property in the stateMachineConfig.states in the template.ts.',
            }),
            buildDescriptionField({
              id: 'rejectedDescription3',
              description: m.hnippNote,
            }),
            buildDescriptionField({
              id: 'rejectedDescription4',
              description: m.deadEnd,
            }),
          ],
        }),
      ],
    }),
  ],
})
