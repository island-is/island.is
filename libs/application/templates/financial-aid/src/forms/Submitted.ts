import {
  buildCustomField,
  buildForm,
  Form,
  FormModes,
} from '@island.is/application/core'

import * as m from '../lib/messages'

export const Submitted: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.status.general.sectionTitle,
  children: [
    buildCustomField({
      id: 'status',
      title: m.status.general.pageTitle,
      component: 'Status',
    }),
  ],
})
