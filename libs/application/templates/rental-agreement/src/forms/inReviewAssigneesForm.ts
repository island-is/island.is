import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { application } from '../lib/messages'
import { summaryNoEditSection } from './inReview/summaryNoEditSection'

export const inReviewAssigneesForm: Form = buildForm({
  id: 'inReviewAssigneesForm',
  title: application.name,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [summaryNoEditSection],
})
