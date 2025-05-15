import {
  buildDescriptionField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import Logo from '../../components/Logo'
import { m } from '../../lib/messages'

export const notAllowedForm = buildForm({
  id: 'notAllowedForm',
  logo: Logo,
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
