import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { externalDataSection } from './externalDataSection'
import { assigneeMockDataSection } from './mockDataSection'
import { otherApprovalSection } from './otherApprovalSection'
import { approveBeingAHousholdMemberSection } from './approveBeingAHousholdMemberSection'
import { shouldRenderMockDataSection } from '../../../utils/prerequisiteMockDataUtils'

export const AssigneePrereqForm = buildForm({
  id: 'AssigneePrereq',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: HmsLogo,
  children: [
    ...(shouldRenderMockDataSection() ? [assigneeMockDataSection] : []),
    approveBeingAHousholdMemberSection,
    otherApprovalSection,
    externalDataSection,
  ],
})
