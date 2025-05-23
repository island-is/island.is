import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../../assets/Logo'
import { applicationStatusSection } from './ApplicationStatusSection'
import { reviewOverviewSection } from './ReviewOverviewSection'
import { application } from '../../lib/messages'

export const ReviewForm: Form = buildForm({
  id: 'ReviewForm',
  title: application.name,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [applicationStatusSection, reviewOverviewSection],
})
