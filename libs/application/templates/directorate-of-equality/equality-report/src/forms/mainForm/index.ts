import { buildForm, buildSection } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfEqualityLogo } from '@island.is/application/assets/institution-logos'
import { aboutTheCompanySection } from './aboutTheCompanySection'
import { equalityReportSection } from './equalityReportSection'
import { overviewSection } from './overview'
import { messages } from '../../lib/messages'

export const MainForm = buildForm({
  id: 'MainForm',
  title: messages.general.applicationName,
  logo: DirectorateOfEqualityLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [aboutTheCompanySection, equalityReportSection, overviewSection],
})
