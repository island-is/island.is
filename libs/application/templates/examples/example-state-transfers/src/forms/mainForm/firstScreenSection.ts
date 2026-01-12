import { buildMultiField, buildSection } from '@island.is/application/core'
import { buildDescriptionField } from '@island.is/application/core'

export const firstScreenSection = buildSection({
  id: 'firstScreen',
  title: 'The current state',
  children: [
    buildMultiField({
      id: 'multiField',
      title: 'Draft state',
      children: [
        buildDescriptionField({
          id: 'description',
          description:
            'Now you just did the first state transfer. You went from PREQUISITES to DRAFT.',
        }),
        buildDescriptionField({
          id: 'description2',
          description:
            'The buildSubmitField in the prerequisites form triggered the submit event.',
        }),
        buildDescriptionField({
          id: 'description3',
          description:
            'In template.ts we defined that the submit event should move the application to the DRAFT state. Additionally we had the option refetchApplicationAfterSubmit: true, which makes sure to show you the form that corresponds to the DRAFT state.',
        }),
        buildDescriptionField({
          id: 'description4',
          description:
            "If we don't set the option refetchApplicationAfterSubmit: true, we can continue to view later screens in the previous form even though we have done the state transfer.",
        }),
        buildDescriptionField({
          id: 'description5',
          description:
            'This can be useful in some cases but best practice is to aim for the flow design is to always show screens matching to the state.',
        }),
      ],
    }),
  ],
})
