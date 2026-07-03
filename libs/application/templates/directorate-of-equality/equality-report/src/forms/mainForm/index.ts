import { buildForm, buildSection } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { CoatOfArms } from '@island.is/application/assets/institution-logos'
import { aboutTheCompanySection } from './aboutTheCompanySection'
import { equalityReportSection } from './equalityReportSection'
import { overviewSection } from './overview'
import { messages } from '../../lib/messages'

export const MainForm = buildForm({
  id: 'MainForm',
  title: messages.general.applicationName,
  logo: CoatOfArms,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'prerequisitesSection',
      title: messages.prerequisites.section.sectionTitle,
      children: [],
    }),
    aboutTheCompanySection,
    equalityReportSection,
    overviewSection,
  ],
})
