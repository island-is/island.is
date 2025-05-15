import {
  buildForm,
  buildCustomField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { information, externalData, payment, review } from '../lib/messages'
import { Logo } from '../assets/Logo'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
  logo: Logo,
  mode: FormModes.COMPLETED,
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
      id: 'reviewSection',
      title: review.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'approved',
      title: review.general.approvedSectionTitle,
      children: [
        buildCustomField({
          component: 'Review',
          id: 'review',
          description: '',
        }),
      ],
    }),
  ],
})
