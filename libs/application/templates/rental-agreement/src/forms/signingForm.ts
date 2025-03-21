import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { application } from '../lib/messages'
import { SigningSection } from './signing/signingSection'

export const SigningForm: Form = buildForm({
  id: 'SigningForm',
  title: application.name,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [SigningSection],
})
