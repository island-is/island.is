import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../assets/Logo'

export const Conclusion: Form = buildForm({
  id: 'ConclusionApplicationForm',
  title: '',
  logo: Logo,
  mode: FormModes.COMPLETED,
  children: [],
})
