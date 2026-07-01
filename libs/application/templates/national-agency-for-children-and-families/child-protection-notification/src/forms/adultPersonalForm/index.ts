import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'

import { overviewSection } from './overviewSection'
import { firstSection } from './firstSection'
import { secondSection } from './secondSection'

export const AdultPersonalForm = buildForm({
  id: 'AdultPersonalForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [firstSection, secondSection, overviewSection],
})
