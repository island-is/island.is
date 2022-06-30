import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
} from '@island.is/application/core'
import {
  applicantInformation,
  conclusion,
  externalData,
  fishingLicense,
  overview,
  payment,
  shipSelection,
} from '../lib/messages'

export const GeneralFishingLicensePaymentForm: Form = buildForm({
  id: 'GeneralFishingLicensePaymentForm',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: false,
  children: [
    buildSection({
      id: 'ExternalDataSection',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
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
      children: [
        buildCustomField({
          component: 'PaymentPendingScreen',
          id: 'paymentPendingField',
          title: '',
        }),
      ],
    }),
    buildSection({
      id: 'conclusionSection',
      title: conclusion.general.sectionTitle,
      children: [],
    }),
  ],
})
