import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
} from '@island.is/application/core'
import CoatOfArms from '../assets/CoatOfArms'
import { m } from '../lib/messages'

export const delegated: Form = buildForm({
  id: 'delegated',
  title: '',
  mode: FormModes.APPLYING,
  logo: CoatOfArms,
  children: [
    buildCustomField({
      id: 'delegated',
      component: 'Delegated',
      title: m.delegatedTitle,
    }),
  ],
})
