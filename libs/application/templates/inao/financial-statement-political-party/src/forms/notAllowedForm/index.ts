import { buildForm } from '@island.is/application/core'
import { notAllowedSection } from './notAllowedSection'
import { InaoLogo } from '@island.is/application/assets/institution-logos'

export const notAllowedForm = buildForm({
  id: 'notAllowedForm',
  logo: InaoLogo,
  children: [notAllowedSection],
})
