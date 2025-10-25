import { buildForm, buildCustomField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../lib/messages'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
  mode: FormModes.APPROVED,
  logo: TransportAuthorityLogo,
  children: [
    buildCustomField({
      id: 'approved',
      component: 'Congratulations',
      title: m.assessmentReceived,
    }),
  ],
})
