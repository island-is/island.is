import { buildSection } from '@island.is/application/core'
import { conditionsSubsection } from './conditionsSubsection'
import { conditions2Subsection } from './conditions2Subsection'
import { getDataFromExternalDataSubsection } from './getDataFromExternalDataSection'

export const commonActionsSection = buildSection({
  id: 'commonActions',
  title: 'Common actions',
  children: [
    getDataFromExternalDataSubsection,
    conditionsSubsection,
    conditions2Subsection,
  ],
})
