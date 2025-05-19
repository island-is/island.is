import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'

import { confirmReadSection } from './confirmReadSection'
import { externalDataSection } from './externalDataSection'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [confirmReadSection, externalDataSection],
})
