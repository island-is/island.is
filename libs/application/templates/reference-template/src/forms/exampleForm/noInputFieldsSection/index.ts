import { buildSection } from '@island.is/application/core'
import { descriptionSubsection } from './descriptionSubsection'
import { dividerSubsection } from './dividerSubsection'
import { accordionSubsection } from './accordionSubsection'
import { actionCardSubsection } from './actionCardSubsection'
import { keyValueSubsection } from './keyValueSubsection'
export const noInputFieldsSection = buildSection({
  id: 'noInputFieldsSection',
  title: 'Fields with no inputs',
  children: [
    descriptionSubsection,
    dividerSubsection,
    accordionSubsection,
    actionCardSubsection,
    keyValueSubsection,
  ],
})
