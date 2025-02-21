import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { primarySchoolMessages } from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: primarySchoolMessages.overview.sectionTitle,
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
          title: primarySchoolMessages.overview.submitButton,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: primarySchoolMessages.overview.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
