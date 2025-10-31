import { buildForm, buildCustomField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../lib/messages'

export const done: Form = buildForm({
  id: 'done',
  title: m.confirmationComplete,
  mode: FormModes.COMPLETED,
  logo: TransportAuthorityLogo,
  children: [
    buildCustomField({
      id: 'schoolConfirmed',
      component: 'SchoolConfirmed',
    }),
  ],
})
