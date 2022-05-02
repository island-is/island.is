import { buildCustomField, buildForm, Form } from '@island.is/application/core'

import * as m from '../lib/messages'

export const ApplicantSubmitted: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.status.sectionTitle,
  children: [
    buildCustomField({
      id: 'applicantStatus',
      title: m.status.pageTitle,
      component: 'ApplicantStatus',
    }),
  ],
})
