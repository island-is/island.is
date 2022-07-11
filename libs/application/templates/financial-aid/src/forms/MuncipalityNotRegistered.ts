import { buildCustomField, buildForm } from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { Routes } from '../lib/constants'

import * as m from '../lib/messages'

export const MuncipalityNotRegistered: Form = buildForm({
  id: 'FinancialAidApplication',
  title: '',
  children: [
    buildCustomField({
      id: Routes.SERVICECENTER,
      title: m.serviceCenter.general.pageTitle,
      component: 'ServiceCenter',
    }),
  ],
})
