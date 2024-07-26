import {
  buildCustomField,
  buildForm,
  buildMultiField,
} from '@island.is/application/core'
import { Application, Form } from '@island.is/application/types'
import { Routes } from '../../lib/constants'

import * as m from '../../lib/messages'
import { createElement } from 'react'
import { Logo } from '../../components/Logo/Logo'

export const SpouseSubmitted: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.status.sectionTitle,
  logo: (application: Application) => {
    const logo = createElement(Logo, { application })
    return () => logo
  },
  children: [
    buildMultiField({
      id: Routes.SPOUSESTATUS,
      title: m.status.pageTitle,
      children: [
        buildCustomField({
          id: Routes.SPOUSESTATUS,
          title: m.status.spousePageTitle,
          component: 'SpouseStatus',
        }),
      ],
    }),
  ],
})
