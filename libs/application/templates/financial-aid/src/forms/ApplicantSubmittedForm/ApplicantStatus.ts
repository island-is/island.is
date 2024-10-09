import { buildCustomField, buildSection } from '@island.is/application/core'
import { Routes } from '../../lib/constants'
import * as m from '../../lib/messages'

export const ApplicantStatus = buildSection({
  id: Routes.APPLICANTSTATUS,
  title: 'Staða umsóknar',
  children: [
    buildCustomField({
      id: Routes.APPLICANTSTATUS,
      title: m.status.pageTitle,
      component: 'ApplicantStatus',
    }),
  ],
})
