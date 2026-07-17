import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { childInfoManualSection } from '../shared/childInfoManualSection'
import { conclusionSection } from '../shared/conclusionSection'
import { memmSection } from './memmSection'
import { parentsSection } from '../shared/parentsSection'
import { protectiveFactorsSection } from '../shared/protectiveFactorsSection'
import { overviewSection } from './overviewSection'
import { reasonForNotificationSection } from './reasonForNotificationSection'
import { childSafetySection } from '../shared/childSafetySection'

export const AdultProcurationForm = buildForm({
  id: 'AdultProcurationForm',
  mode: FormModes.DRAFT,
  children: [
    childInfoManualSection,
    parentsSection,
    memmSection,
    reasonForNotificationSection,
    protectiveFactorsSection,
    childSafetySection,
    overviewSection,
    conclusionSection,
  ],
})
