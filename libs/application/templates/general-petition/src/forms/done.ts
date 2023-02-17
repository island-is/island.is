import { buildForm, buildCustomField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'

export const done: Form = buildForm({
  id: 'done',
  title: m.finalTitle,
  logo: Logo,
  mode: FormModes.COMPLETED,
  children: [
    buildCustomField({
      id: 'done',
      title: m.finalTitle,
      component: 'ListSubmitted',
    }),
  ],
})
