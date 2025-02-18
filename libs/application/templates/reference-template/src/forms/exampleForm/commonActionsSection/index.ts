import { buildSection } from '@island.is/application/core'
import { conditionsSubsection } from './conditionsSubsection'
import { conditions2Subsection } from './conditions2Subsection'
import { getDataFromExternalDataSubsection } from './getDataFromExternalDataSection'
import { validationSubsection } from './validadionSubsection'
import { clearOnChangeSubsection } from './clearOnChangeSubsection'

export const commonActionsSection = buildSection({
  id: 'commonActions',
  title: 'Common actions',
  children: [
    getDataFromExternalDataSubsection,
    validationSubsection,
    clearOnChangeSubsection,
    conditionsSubsection,
    conditions2Subsection,
  ],
})
