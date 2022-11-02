import {
  buildForm,
  buildCustomField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { information, externalData, payment } from '../lib/messages'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
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
      id: 'informationSection',
      title: information.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [],
    }),
  ],
})
