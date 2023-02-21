import {
  buildForm,
  buildCustomField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const signPetitionForm: Form = buildForm({
  id: 'signPetitionForm',
  title: '',
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'signPetitionForm',
      title: '',
      children: [
        buildCustomField({
          id: 'signPetitionForm',
          title: '',
          component: 'SignPetitionView',
        }),
      ],
    }),
  ],
})
