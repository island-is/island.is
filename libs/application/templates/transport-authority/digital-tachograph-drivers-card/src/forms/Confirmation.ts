import {
  buildForm,
  buildCustomField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../assets/Logo'
import {
  cardType,
  applicant,
  externalData,
  payment,
  confirmation,
} from '../lib/messages'

export const Confirmation: Form = buildForm({
  id: 'ConfirmationForm',
  title: '',
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'cardTypeSection',
      title: cardType.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'applicantSection',
      title: applicant.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [
        buildCustomField({
          component: 'Confirmation',
          id: 'confirmation',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
