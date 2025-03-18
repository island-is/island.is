import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../../assets/Logo'
import { applicationStatusSection } from './ApplicationStatusSection'
import { reviewOverviewSection } from './ReviewOverviewSection'

export const ReviewForm: Form = buildForm({
  id: 'ReviewForm',
  title: '',
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [applicationStatusSection, reviewOverviewSection],
})
