import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'

import { confirmReadSection } from '../prerequisitesForm/confirmReadSection'
import { externalDataSection } from './externalDataSection'
import { HmsLogo } from '@island.is/application/assets/institution-logos'

export const PrerequisitesProcureForm = buildForm({
  id: 'PrerequisitesProcureForm',
  mode: FormModes.NOT_STARTED,
  logo: HmsLogo,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [confirmReadSection, externalDataSection],
})
