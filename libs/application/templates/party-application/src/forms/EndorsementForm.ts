import {
  buildForm,
  buildCustomField,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from '../lib/messages'

import Logo from '../assets/Logo'

export const EndorsementApplication: Form = buildForm({
  id: 'Endorse',
  title: m.collectEndorsements.applicationTitle,
  mode: FormModes.REVIEW,
  logo: Logo,
  children: [
    buildSection({
      id: 'intro',
      title: m.collectEndorsements.stepTitle,
      children: [
        buildCustomField({
          id: 'disclaimer',
          title: '',
          component: 'EndorsementDisclaimer',
        }),
      ],
    }),
  ],
})
