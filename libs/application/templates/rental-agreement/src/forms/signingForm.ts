import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { Signing } from './signing'
import { application } from '../lib/messages'

export const SigningForm: Form = buildForm({
  id: 'SigningForm',
  title: application.name,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [Signing],
})
