import { buildForm } from '@island.is/application/core'
import { descriptionSection } from './descriptionSection'
import { titleSection } from './titleSection'
import { copyLinkSection } from './copyLinkSection'
import { dividerSection } from './dividerSection'
import { alertMessageSection } from './alertMessageSection'
import { accordionSection } from './accordionSection'
import { actionCardSection } from './actionCardSection'
import { keyValueSection } from './keyValueSection'
import { overviewSection } from './overviewSection'

export const mainForm = buildForm({
  id: 'mainForm',
  title: 'Main form',
  renderLastScreenButton: true,
  children: [
    descriptionSection,
    titleSection,
    copyLinkSection,
    dividerSection,
    alertMessageSection,
    accordionSection,
    actionCardSection,
    keyValueSection,
    overviewSection,
  ],
})
