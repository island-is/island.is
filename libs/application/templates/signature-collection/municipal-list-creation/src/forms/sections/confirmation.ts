import {
  YES,
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const confirmation = buildSection({
  id: 'confirmCreation',
  title: m.confirmCreation,
  children: [
    buildMultiField({
      id: 'confirmCreation',
      title: m.confirmCreation,
      description: m.confirmCreationDescription,
      children: [
        buildDescriptionField({
          id: 'confirmSpace',
          space: 'containerGutter',
          titleVariant: 'h3',
        }),
        buildCheckboxField({
          id: 'confirmCreationCheckbox',
          large: true,
          options: [{ value: YES, label: m.confirmCreationCheckboxLabel }],
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: m.createList,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.createList,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
