import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { FjarskiptastofaLogo } from '@island.is/application/assets/institution-logos'
import { assessmentSection } from './assessmentSection'
import { overviewSection } from './overview'
import { m } from '../../lib/messages'

export const MainForm = buildForm({
  id: 'MainForm',
  logo: FjarskiptastofaLogo,
  title: m.application.name,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [assessmentSection, overviewSection],
})
