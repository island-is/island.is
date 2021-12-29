import { buildForm, Form, FormModes } from '@island.is/application/core'
import { Logo } from '../assets'
import { conclusionSection } from './GeneralFishingLicenseForm/conclusionSection'

export const GeneralFishingLicenseSubmittedForm: Form = buildForm({
  id: 'GeneralFishingLicenseSubmittedForm',
  title: '',
  logo: Logo,
  children: [conclusionSection],
})
