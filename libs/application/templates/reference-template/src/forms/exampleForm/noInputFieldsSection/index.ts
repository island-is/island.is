import { buildSection } from '@island.is/application/core'
import { descriptionSubsection } from './descriptionSubsection'
import { dividerSubsection } from './dividerSubsection'
import { titleSubsection } from './titleSubsection'
import { accordionSubsection } from './accordionSubsection'
import { actionCardSubsection } from './actionCardSubsection'
import { keyValueSubsection } from './keyValueSubsection'
import { alertMessageSubsection } from './alertMessageSubsection'
import { copyLinkSubsection } from './copyLinkSubsection'
import { informationCardSubSection } from './informationCardSubSection'
export const noInputFieldsSection = buildSection({
  id: 'noInputFieldsSection',
  title: 'Fields without inputs',
  children: [
    descriptionSubsection,
    titleSubsection,
    copyLinkSubsection,
    dividerSubsection,
    alertMessageSubsection,
    accordionSubsection,
    actionCardSubsection,
    keyValueSubsection,
    informationCardSubSection,
  ],
})
