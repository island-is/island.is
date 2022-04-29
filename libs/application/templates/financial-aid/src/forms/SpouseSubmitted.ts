import { buildCustomField, buildForm, Form } from '@island.is/application/core'

import * as m from '../lib/messages'

export const SpouseSubmitted: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.status.sectionTitle,
  children: [
    buildCustomField({
      id: 'spouseStatus',
      title: m.status.spousePageTitle,
      component: 'SpouseStatus',
    }),
  ],
})
