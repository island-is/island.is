import { buildCustomField, buildForm, Form } from '@island.is/application/core'

import * as m from '../lib/messages'

export const MuncipalityNotRegistered: Form = buildForm({
  id: 'FinancialAidApplication',
  title: '',
  children: [
    buildCustomField({
      id: 'serviceCenter',
      title: m.serviceCenter.general.pageTitle,
      component: 'ServiceCenter',
    }),
  ],
})
