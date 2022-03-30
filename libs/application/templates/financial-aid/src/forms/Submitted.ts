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
      id: 'status',
      title: m.status.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'status',
          title: m.status.general.pageTitle,
          component: 'Status',
        }),
      ],
    }),
  ],
})
