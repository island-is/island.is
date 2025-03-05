import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../assets/Logo'
import { applicationStatusSection } from './ReviewForm/ApplicationStatusSection'

export const ApplicantReview: Form = buildForm({
  id: 'ApplicantReview',
  title: '',
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  children: [applicationStatusSection],
})
