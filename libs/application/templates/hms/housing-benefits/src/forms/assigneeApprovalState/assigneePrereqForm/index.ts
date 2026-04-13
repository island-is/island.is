import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'

import { externalDataSection } from './externalDataSection'
import { assigneeMockDataSection } from './mockDataSection'
import { otherApprovalSection } from './otherApprovalSection'

export const AssigneePrereqForm = buildForm({
  id: 'AssigneePrereq',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: HmsLogo,
  children: [assigneeMockDataSection, otherApprovalSection, externalDataSection],
})
