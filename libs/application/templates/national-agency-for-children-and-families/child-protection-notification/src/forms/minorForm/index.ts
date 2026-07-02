import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'

import { overviewSection } from './overviewSection'
import { minorFirstSection } from './firstSection'

export const MinorForm = buildForm({
  id: 'MinorForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [minorFirstSection, overviewSection],
})
