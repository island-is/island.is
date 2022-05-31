import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildDescriptionField,
  buildSubmitField,
  DefaultEvents
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { Application } from '../../../types/schema'

export const keyNumbersSection = buildSection({
  id: 'confirmation',
  title: m.confirm,
  children: [
    buildMultiField({
      title: '',
      children: [
        buildDescriptionField({
          id: 'overview',
          title: m.lessoverviewSectionTitle,
          description: m.lessOverviewSectionDescription,
        }),
        buildSubmitField({
          id: 'submit',
          title: '',
          placement: 'screen',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'Senda inn umsókn',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
}),
