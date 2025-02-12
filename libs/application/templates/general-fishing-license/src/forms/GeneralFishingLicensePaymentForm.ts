import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
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
  mode: FormModes.IN_PROGRESS,
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
        }),
      ],
    }),
    buildFormConclusionSection({
      alertTitle: conclusion.general.title,
      expandableHeader: conclusion.information.title,
      expandableDescription: conclusion.information.bulletList,
    }),
  ],
})
