import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
} from '@island.is/application/core'
import {
  applicantInformation,
  conclusion,
  fishingLicense,
  overview,
  payment,
  shipSelection,
} from '../../lib/messages'
import { externalDataSection } from './externalDataSection'

export const GeneralFishingLicensePrerequisitesForm: Form = buildForm({
  id: 'GeneralFishingLicensePrerequisitesForm',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: false,
  children: [
    externalDataSection,
    buildSection({
      id: 'applicantInformationSection',
      title: applicantInformation.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'shipSelectionSection',
      title: shipSelection.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'fishingLicenseSection',
      title: fishingLicense.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'overviewSection',
      title: overview.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'awaitingPayment',
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
