import {
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import { Logo } from '../../assets'
import { shipSelectionSection } from './shipSelectionSection'
import { fishingLicenseSection } from './fishingLicenseSection'
import { overviewSection } from './overviewSection'
import { conclusion, externalData, payment } from '../../lib/messages'
import { applicantInformationSection } from './applicantInformationSection'

export const GeneralFishingLicenseForm: Form = buildForm({
  id: 'GeneralFishingLicenseForm',
  title: '',
  logo: Logo,
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'ExternalDataSection',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
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
