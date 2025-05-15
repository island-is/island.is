import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

export const statesAndStatusSection = buildSection({
  id: 'statesAndStatus',
  title: 'States and statuses',
  children: [
    buildMultiField({
      id: 'multiField',
      title: 'States and statuses',
      children: [
        buildDescriptionField({
          id: 'statesAndStatusesDescription',
          description:
            'One slightly confusing thing is the difference between states and statuses',
        }),
        buildDescriptionField({
          id: 'statesAndStatusesDescription2',
          description:
            'Statuses are are a fixed list of values that we can group the applications by. Those values are: "draft", "inprogress", "completed", "approved" and "rejected"',
        }),
        buildDescriptionField({
          id: 'statesAndStatusesDescription3',
          description:
            "States can be custom and you can create your own states as you need. However the convention is to make the states reflect the statuses, appart from starting in the PREQUISITES state that doesn't have a matching status.",
        }),
        buildDescriptionField({
          id: 'statesAndStatusesDescription4',
          description:
            'An example of custom states would be if many applicants need to fill in the application. Then you can have states like DRAFT_A and DRAFT_B but both states will have the same status "draft".',
        }),
        buildDescriptionField({
          id: 'statesAndStatusesDescription5',
          description:
            'Another example of custom states would be if many organizations and/or users need to approve the filled in information. Then you can have states like REVIEW_USER, REVIEW_HMS, but both states will have the same status "inprogress".',
        }),
      ],
    }),
  ],
})
