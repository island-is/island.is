import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: newPrimarySchoolMessages.overview.sectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      children: [
        buildCustomField(
          {
            id: 'overviewScreen',
            component: 'Review',
          },
          {
            editable: true,
          },
        ),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: newPrimarySchoolMessages.overview.submitButton,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: newPrimarySchoolMessages.overview.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
