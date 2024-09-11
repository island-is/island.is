import { buildCustomField, buildSection } from '@island.is/application/core'
import { Routes } from '../../lib/constants'
import * as m from '../../lib/messages'

export const SpouseStatus = buildSection({
  id: Routes.SPOUSESTATUS,
  title: m.status.pageTitle,
  children: [
    buildCustomField({
      id: Routes.SPOUSESTATUS,
      title: m.status.spousePageTitle,
      component: 'SpouseStatus',
    }),
  ],
})
