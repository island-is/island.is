import { buildCustomField, buildSubSection } from '@island.is/application/core'
import * as m from '../../../lib/messages'

export const residenceChangeReasonSubSection = buildSubSection({
  id: 'residenceChangeReason',
  title: m.reason.general.sectionTitle,
  children: [
    buildCustomField({
      id: 'residenceChangeReason',
      title: m.reason.general.pageTitle,
      component: 'Reason',
    }),
  ],
})
