import { buildForm, Form, FormModes } from '@island.is/application/core'
import { applicantInformationSection } from './applicantInformationSection'
import { externalDataSection } from './externalDataSection'
import { Logo } from '../assets'

export const GeneralFishingLicenseForm: Form = buildForm({
  id: 'GeneralFishingLicenseForm',
  title: '',
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [externalDataSection, applicantInformationSection],
})
