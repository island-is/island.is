import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { InformationSection } from './InformationSection'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: TransportAuthorityLogo,
  children: [InformationSection],
})
