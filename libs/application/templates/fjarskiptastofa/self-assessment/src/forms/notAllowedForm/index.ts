import {
  buildDescriptionField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { FjarskiptastofaLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../../lib/messages'

// Shown to anyone who is not a company (or a company's procuration holder), so
// individuals get an explanation instead of a blank screen.
export const notAllowedForm = buildForm({
  id: 'notAllowedForm',
  logo: FjarskiptastofaLogo,
  children: [
    buildSection({
      id: 'notAllowedSection',
      title: m.notAllowed.title,
      children: [
        buildDescriptionField({
          id: 'notAllowedDescription',
          title: m.notAllowed.title,
          description: m.notAllowed.description,
        }),
      ],
    }),
  ],
})
