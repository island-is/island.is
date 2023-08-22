import { buildForm, buildCustomField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
  title: '',
  mode: FormModes.APPROVED,
  children: [
    buildCustomField({
      id: 'approved',
      component: 'Congratulations',
      title: m.assessmentReceived,
    }),
  ],
})
