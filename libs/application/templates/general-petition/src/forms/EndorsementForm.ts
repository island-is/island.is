import {
  buildForm,
  buildCustomField,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'

export const EndorsementForm: Form = buildForm({
  id: 'Endorsement form',
  title: '',
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'intro',
      title: m.endorsementForm.stepTitle,
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
