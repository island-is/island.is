import {
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import { applicantInformationSection } from './applicantInformationSection'
import { externalDataSection } from './externalDataSection'
import { Logo } from '../../assets'
import { shipSelectionSection } from './shipSelectionSection'
import { fishingLicenseSection } from './fishingLicenseSection'
import { overviewSection } from './overviewSection'
import { conclusionSection } from './conclusionSection'
import { conclusion, payment } from '../../lib/messages'

export const GeneralFishingLicenseForm: Form = buildForm({
  id: 'GeneralFishingLicenseForm',
  title: '',
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    externalDataSection,
    applicantInformationSection,
    shipSelectionSection,
    fishingLicenseSection,
    overviewSection,
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'conclusionSection',
      title: conclusion.general.sectionTitle,
      children: [],
    }),
  ],
})
