import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Application, Form } from '@island.is/application/types'
import * as m from '../../lib/messages'
import { Routes } from '../../lib/constants'
import { createElement } from 'react'
import { Logo } from '../../components/Logo/Logo'

export const ApplicantSubmitted: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.status.sectionTitle,
  logo: (application: Application) => {
    const logo = createElement(Logo, { application })
    return () => logo
  },
  children: [
    buildSection({
      id: Routes.APPLICANTSTATUS,
      title: '',
      children: [
        buildCustomField({
          id: Routes.APPLICANTSTATUS,
          title: m.status.pageTitle,
          component: 'ApplicantStatus',
        }),
      ],
    }),
  ],
})
