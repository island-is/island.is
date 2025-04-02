import { buildMultiField, buildSubSection } from '@island.is/application/core'
import { employment as employmentMessages } from '../../../lib/messages'

export const currentSituationSubSection = buildSubSection({
  id: 'currentSituationSubSection',
  title: 'currentSituationSubSection',
  children: [
    buildMultiField({
      id: 'currentSituationSubSection',
      title: employmentMessages.currentSituation.pageTitle,
      children: [],
    }),
  ],
})
