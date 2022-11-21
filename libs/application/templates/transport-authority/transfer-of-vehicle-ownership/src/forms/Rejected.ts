import {
  buildForm,
  buildCustomField,
  buildSection,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../assets/Logo'
import {
  information,
  externalData,
  payment,
  conclusion,
  review,
} from '../lib/messages'

export const Rejected: Form = buildForm({
  id: 'RejectedApplicationForm',
  title: '',
  logo: Logo,
  mode: FormModes.REJECTED,
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
      id: 'review',
      title: review.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'conclusion',
      title: conclusion.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'conclusion.multifield',
          title: conclusion.general.title,
          children: [
            buildCustomField({
              component: 'Conclusion',
              id: 'Conclusion',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
