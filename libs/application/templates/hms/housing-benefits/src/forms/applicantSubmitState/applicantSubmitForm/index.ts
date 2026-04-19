import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { infoSection } from './infoSection'
import { applicantOverviewSection } from './applicantOverviewSection'
import { assigneeOverviewSection } from './assigneeOverviewSection'

export const ApplicantSubmitForm = buildForm({
  id: 'ApplicantSubmitForm',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: HmsLogo,
  children: [infoSection, applicantOverviewSection, assigneeOverviewSection],
})
