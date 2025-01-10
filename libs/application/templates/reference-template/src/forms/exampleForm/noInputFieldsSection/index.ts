import { buildSection } from '@island.is/application/core'
import { descriptionSubsection } from './descriptionSubsection'
import { dividerSubsection } from './dividerSubsection'
import { titleSubsection } from './titleSubsection'
import { accordionSubsection } from './accordionSubsection'
import { actionCardSubsection } from './actionCardSubsection'
import { keyValueSubsection } from './keyValueSubsection'
export const noInputFieldsSection = buildSection({
  id: 'noInputFieldsSection',
  title: 'Fields without inputs',
  children: [
    descriptionSubsection,
    dividerSubsection,
    titleSubsection,
    accordionSubsection,
    actionCardSubsection,
    keyValueSubsection,
  ],
})
