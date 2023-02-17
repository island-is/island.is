import {
  buildForm,
  buildCustomField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'

export const signPetitionForm: Form = buildForm({
  id: 'signPetitionForm',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'signPetitionForm',
      title: '',
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
