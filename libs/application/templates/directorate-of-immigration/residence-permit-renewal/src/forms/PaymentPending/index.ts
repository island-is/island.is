import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  agent,
  applicant,
  confirmation,
  expeditedProcessing,
  externalData,
  information,
  payment,
  personal,
} from '../../lib/messages'
import { Logo } from '../../assets/Logo'

export const PaymentPending: Form = buildForm({
  id: 'PaymentPendingForm',
  title: '',
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'personal',
      title: personal.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'applicant',
      title: applicant.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'information',
      title: information.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'agent',
      title: agent.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'expeditedProcessing',
      title: expeditedProcessing.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'subSectionPaymentPendingField',
          component: 'PaymentPendingField',
          title: confirmation.general.sectionTitle,
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
