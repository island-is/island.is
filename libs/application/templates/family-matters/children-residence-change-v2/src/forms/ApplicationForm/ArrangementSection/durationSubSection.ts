import { buildCustomField, buildSubSection } from '@island.is/application/core'
import { selectDurationInputs } from '../../../fields/Duration'
import * as m from '../../../lib/messages'

export const durationSubSection = buildSubSection({
  id: 'duration',
  title: m.duration.general.sectionTitle,
  children: [
    buildCustomField({
      id: 'selectDuration',
      title: m.duration.general.pageTitle,
      childInputIds: selectDurationInputs,
      component: 'Duration',
    }),
  ],
})
