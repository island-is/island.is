import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { childInfoManualSection } from '../shared/childInfoManualSection'
import { parentsSection } from '../shared/parentsSection'
import { protectiveFactorsSection } from '../shared/protectiveFactorsSection'
import { overviewSection } from './overviewSection'

export const AdultProcurationForm = buildForm({
  id: 'AdultProcurationForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    childInfoManualSection,
    parentsSection,
    protectiveFactorsSection,
    overviewSection,
  ],
})
