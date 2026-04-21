import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { PreSignatureInfoSection } from './preSignatureInfoSection'
import { ReviewInfoSection } from './reviewInfoSection'
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
