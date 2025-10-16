import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'

import HmsLogo from '../../assets/HmsLogo'
import { confirmReadSection } from './confirmReadSection'
import { externalDataSection } from './externalDataSection'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  logo: HmsLogo,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [externalDataSection, confirmReadSection],
})
