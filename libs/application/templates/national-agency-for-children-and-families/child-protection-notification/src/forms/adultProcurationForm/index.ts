import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { childInfoManualSection } from '../shared/childInfoManualSection'
import { conclusionSection } from '../shared/conclusionSection'
import { parentsSection } from '../shared/parentsSection'
import { protectiveFactorsSection } from '../shared/protectiveFactorsSection'
import { overviewSection } from './overviewSection'

export const AdultProcurationForm = buildForm({
  id: 'AdultProcurationForm',
  mode: FormModes.DRAFT,
  children: [
    childInfoManualSection,
    parentsSection,
    protectiveFactorsSection,
    overviewSection,
    conclusionSection,
  ],
})
