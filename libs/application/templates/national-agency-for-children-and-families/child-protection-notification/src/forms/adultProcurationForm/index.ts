import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { childInfoManualSection } from '../shared/childInfoManualSection'
import { parentsSection } from '../shared/parentsSection'
import { protectiveFactorsSection } from '../shared/protectiveFactorsSection'
import { overviewSection } from './overviewSection'
import { reasonForNotificationSection } from './reasonForNotificationSection'

export const AdultProcurationForm = buildForm({
  id: 'AdultProcurationForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    childInfoManualSection,
    parentsSection,
    reasonForNotificationSection,
    protectiveFactorsSection,
    overviewSection,
  ],
})
