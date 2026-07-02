import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { childInfoManualSection } from '../shared/childInfoManualSection'
import { expectantParentsSection } from '../shared/expectantParentsSection'
import { delegationSection } from './delegationSection'
import { overviewSection } from './overviewSection'

export const AdultProcurationForm = buildForm({
  id: 'AdultProcurationForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    childInfoManualSection,
    expectantParentsSection,
    delegationSection,
    overviewSection,
  ],
})
