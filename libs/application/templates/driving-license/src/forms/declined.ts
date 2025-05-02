import { buildForm, buildCustomField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const declined: Form = buildForm({
  id: 'declined',
  mode: FormModes.REJECTED,
  children: [
    buildCustomField({
      id: 'rejected',
      component: 'Declined',
      title: m.applicationDenied,
    }),
  ],
})
