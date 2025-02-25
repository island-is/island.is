import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  information,
  externalData,
  payment,
  review,
  conclusion,
} from '../lib/messages'
import { Logo } from '../assets/Logo'

export const ReviewSellerForm: Form = buildForm({
  id: 'ReviewSellerForm',
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
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
    buildSection({
      id: 'confirmation',
      title: conclusion.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'reviewSellerSection',
      title: review.general.sectionTitle,
      children: [
        buildCustomField({
          component: 'Conclusion',
          id: 'conslusion',
          description: '',
        }),
      ],
    }),
  ],
})
