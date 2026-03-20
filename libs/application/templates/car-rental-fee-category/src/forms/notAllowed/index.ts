import {
  buildDescriptionField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const notAllowedForm = buildForm({
  id: 'notAllowedForm',
  children: [
    buildSection({
      id: 'notAllowedSection',
      children: [
        buildDescriptionField({
          id: 'notAllowedDescription',
          title: m.notAllowed.descriptionTitle,
          description: m.notAllowed.descriptionText,
        }),
      ],
    }),
  ],
})
