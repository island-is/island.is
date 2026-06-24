import { buildForm, buildCustomField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const declinedForm: Form = buildForm({
  id: 'declinedForm',
  mode: FormModes.REJECTED,
  children: [
    buildCustomField({
      id: 'rejected',
      component: 'Declined',
      title: m.applicationDenied,
    }),
  ],
})
