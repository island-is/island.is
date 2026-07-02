import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'

import { overviewSection } from './overviewSection'
import { delegationSection } from './delegationSection'

export const AdultProcurationForm = buildForm({
  id: 'AdultProcurationForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [delegationSection, overviewSection],
})
