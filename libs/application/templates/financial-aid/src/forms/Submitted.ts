import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'

import * as m from '../lib/messages'

export const Submitted: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'submitted',
      title: m.section.received,
      children: [
        buildCustomField({
          id: 'residenceChangeConfirmation',
          title: m.confirmation.general.pageTitle,
          component: 'Confirmation',
        }),
      ],
    }),
  ],
})
