import { buildForm } from '@island.is/application/core'
import { notAllowedSection } from './notAllowedSection'
import Logo from '../../components/Logo'

export const notAllowedForm = buildForm({
  id: 'notAllowedForm',
  title: '',
  logo: Logo,
  children: [notAllowedSection],
})
