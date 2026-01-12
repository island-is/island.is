import {
  buildDescriptionField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { InaoLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../../lib/messages'

export const notAllowedForm = buildForm({
  id: 'notAllowedForm',
  logo: InaoLogo,
  children: [
    buildSection({
      id: 'notAllowedSection',
      title: '',
      children: [
        buildDescriptionField({
          id: 'notAllowedDescription',
          title: m.notAllowedTitle,
          description: m.notAllowedDescription,
        }),
      ],
    }),
  ],
})
