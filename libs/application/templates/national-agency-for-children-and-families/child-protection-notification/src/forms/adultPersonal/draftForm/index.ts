import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'

import { conclusionSection } from '../../shared/conclusionSection'
import { overviewSection } from './overviewSection'
import { firstSection } from './firstSection'
import { secondSection } from './secondSection'

export const AdultPersonalDraftForm = buildForm({
  id: 'AdultPersonalDraftForm',
  mode: FormModes.DRAFT,
  children: [firstSection, secondSection, overviewSection, conclusionSection],
})
