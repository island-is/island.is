import {
  buildMultiField,
  buildSubmitField,
  buildSubSection,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { prerequisitesMessages } from '../../lib/messages'

export const childSubSection = buildSubSection({
  id: 'childSubSection',
  title: prerequisitesMessages.child.subSectionTitle,
  children: [
    buildMultiField({
      id: 'child',
      title: prerequisitesMessages.child.subSectionTitle,
      children: [
        // TODO: Add fields for child information
        buildSubmitField({
          id: 'submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: prerequisitesMessages.child.startNotification,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
