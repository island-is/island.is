import { buildCustomField, buildForm } from '@island.is/application/core'
import { Application, Form } from '@island.is/application/types'
import { Routes } from '../lib/constants'

import * as m from '../lib/messages'
import { Logo } from '../components/Logo/Logo'
import { createElement } from 'react'

export const MuncipalityNotRegistered: Form = buildForm({
  id: 'FinancialAidApplication',
  logo: (application: Application) => {
    const logo = createElement(Logo, { application })
    return () => logo
  },
  children: [
    buildCustomField({
      id: Routes.SERVICECENTER,
      title: m.serviceCenter.general.pageTitle,
      component: 'ServiceCenter',
    }),
  ],
})
