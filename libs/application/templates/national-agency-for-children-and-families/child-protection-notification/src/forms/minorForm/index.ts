import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'

import { conclusionSection } from '../shared/conclusionSection'
import { overviewSection } from './overviewSection'
import { minorFirstSection } from './firstSection'

export const MinorForm = buildForm({
  id: 'MinorForm',
  mode: FormModes.DRAFT,
  children: [minorFirstSection, overviewSection, conclusionSection],
})
