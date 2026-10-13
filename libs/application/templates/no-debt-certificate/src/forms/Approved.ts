import {
  buildForm,
  buildCustomField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { DebtCollectorLogo } from '@island.is/application/assets/institution-logos'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
  logo: DebtCollectorLogo,
  mode: FormModes.APPROVED,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [
        buildCustomField({
          component: 'ConfirmationField',
          id: 'confirmationField',
          description: '',
        }),
      ],
    }),
  ],
})
