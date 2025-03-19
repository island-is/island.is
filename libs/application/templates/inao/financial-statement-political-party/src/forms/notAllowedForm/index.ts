import { buildForm } from '@island.is/application/core'
import { notAllowedSection } from './notAllowedSection'
import Logo from '../../components/Logo'

export const notAllowedForm = buildForm({
  id: 'notAllowedForm',
  logo: Logo,
  children: [notAllowedSection],
})
