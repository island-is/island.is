import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { applicationStatusSection } from './ApplicationStatusSection'
import { reviewOverviewSection } from './ReviewOverviewSection'
import { application } from '../../lib/messages'

export const ReviewForm: Form = buildForm({
  id: 'ReviewForm',
  title: application.name,
  logo: AoshLogo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [applicationStatusSection, reviewOverviewSection],
})
