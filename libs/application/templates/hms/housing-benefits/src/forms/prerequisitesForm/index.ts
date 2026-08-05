import { buildForm } from '@island.is/application/core'

import { FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { externalDataSection } from './externalDataSection'
import { confirmReadSection } from './confirmReadSection'
import { confirmMunicipality } from './confirmMunicipality'
import { mockDataSection } from './mockDataSection'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  logo: HmsLogo,
  children: [
    mockDataSection,
    confirmReadSection,
    confirmMunicipality,
    externalDataSection,
  ],
})
