import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../../assets/Logo'
import { paymentArrangementSection } from './paymentArrangementSection'

export const SeminarRegistrationForm: Form = buildForm({
  id: 'SeminarRegistrationFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: false,
  children: [paymentArrangementSection],
})
