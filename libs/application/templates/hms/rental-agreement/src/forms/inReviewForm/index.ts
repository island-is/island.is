import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../../assets/Logo'
import { PreSignatureInfoSection } from './preSignatureInfoSection'
import { ReviewInfoSection } from './reviewInfoSection'
import * as m from '../../lib/messages'

export const inReviewApplicantForm: Form = buildForm({
  id: 'inReviewApplicantForm',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [ReviewInfoSection, PreSignatureInfoSection],
})
