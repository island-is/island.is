import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { externalDataSection } from './externalDataSection'

export const PrerequisitesProcureForm = buildForm({
  id: 'PrerequisitesProcureForm',
  mode: FormModes.NOT_STARTED,
  logo: HmsLogo,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [externalDataSection],
})
