import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { childSection } from '../childSection'
import { delegationSection } from './delegationSection'
import { overviewSection } from './overviewSection'

export const AdultProcurationForm = buildForm({
  id: 'AdultProcurationForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [childSection, delegationSection, overviewSection],
})
