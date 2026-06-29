import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'

import { overviewSection } from '../overview'
import { delegationSection } from './delegationSection'

export const AdultProcurationForm = buildForm({
  id: 'AdultProcurationForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [delegationSection, overviewSection],
})
