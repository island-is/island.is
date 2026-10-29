import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { PreSignatureInfoSection } from './preSignatureInfoSection'
import { ReviewInfoSection } from './reviewInfoSection'
import { AssigneeReviewSection } from './assigneeReviewSection'
import * as m from '../../lib/messages'

export const inReviewApplicantForm: Form = buildForm({
  id: 'inReviewApplicantForm',
  title: m.application.name,
  logo: HmsLogo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [ReviewInfoSection, PreSignatureInfoSection],
})

// Read-only view for the other parties to the contract
export const inReviewAssigneeForm: Form = buildForm({
  id: 'inReviewAssigneeForm',
  title: m.application.name,
  logo: HmsLogo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [AssigneeReviewSection],
})
