import {
  buildDescriptionField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'

export const overviewSection = buildSection({
  id: 'overview',
  title: 'Overview',
  children: [
    buildMultiField({
      id: 'overviewFields',
      title: 'Overview',
      children: [
        buildOverviewField({
          id: 'overview',
          title: '',
          bottomLine: false,
          backId: 'email',
          items: (answers) => {
            return [
              {
                width: 'full',
                keyText: 'Email',
                valueText: getValueViaPath<string>(answers, 'email') ?? '',
              },
            ]
          },
        }),
        buildDescriptionField({
          id: 'description',
          description:
            'If you choose to move the application to the IN_REVIEW state, then we have defined the stateMachineOption action "assignUser" that will run on this event and assign the nationalId from the previous screen to be the assignee/reviewer of the application.',
        }),
        buildSubmitField({
          id: 'submitApplication2',
          placement: 'screen',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'Move to state COMPLETED',
              type: 'primary',
            },
            {
              event: DefaultEvents.ASSIGN,
              name: 'Move to state IN_REVIEW',
              type: 'subtle',
            },
          ],
        }),
      ],
    }),
  ],
})
