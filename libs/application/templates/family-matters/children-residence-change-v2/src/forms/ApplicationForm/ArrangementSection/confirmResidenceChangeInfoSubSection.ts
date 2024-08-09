import { buildCustomField, buildSubSection } from '@island.is/application/core'
import * as m from '../../../lib/messages'

export const confirmResidenceChangeInfoSubSection = buildSubSection({
  id: 'confirmResidenceChangeInfo',
  title: m.newResidence.general.sectionTitle,
  children: [
    buildCustomField({
      id: 'confirmResidenceChangeInfo',
      title: m.newResidence.general.pageTitle,
      component: 'ChangeInformation',
    }),
  ],
})
