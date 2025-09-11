import {
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../lib/messages'
import { overviewFields } from '../../utils/overviewFields'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: newPrimarySchoolMessages.overview.sectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: newPrimarySchoolMessages.overview.sectionTitle,
      description: newPrimarySchoolMessages.overview.overviewDescription,
      children: [
        ...overviewFields(true),
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
