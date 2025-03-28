import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { dataproviderSection } from './dataProviderSection'
import { introSection } from './introSection'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [introSection, dataproviderSection],
})
