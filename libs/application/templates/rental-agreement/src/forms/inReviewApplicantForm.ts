import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { application } from '../lib/messages'
import { PreSignatureInfoSection } from './inReview/preSignatureInfoSection'
import { ReviewInfoSection } from './inReview/reviewInfoSection'

export const inReviewApplicantForm: Form = buildForm({
  id: 'inReviewApplicantForm',
  title: application.name,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [ReviewInfoSection, PreSignatureInfoSection],
})
