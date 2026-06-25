import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'

import { overviewSection } from '../overview'
import { umbodSection } from './umbodSection'

export const AdultProcurationForm = buildForm({
  id: 'AdultProcurationForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [umbodSection, overviewSection],
})
