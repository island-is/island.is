import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { childInfoManualSection } from '../../shared/childInfoManualSection'
import { childSafetySection } from '../../shared/childSafetySection'
import { conclusionSection } from '../../shared/conclusionSection'
import { parentsSection } from '../../shared/parentsSection'
import { reasonForNotificationSection } from '../../shared/reasonForNotificationSection'
import { overviewSection } from './overviewSection'

export const AdultPersonalDraftForm = buildForm({
  id: 'AdultPersonalDraftForm',
  mode: FormModes.DRAFT,
  children: [
    childInfoManualSection,
    parentsSection,
    reasonForNotificationSection,
    childSafetySection,
    overviewSection,
    conclusionSection,
  ],
})
