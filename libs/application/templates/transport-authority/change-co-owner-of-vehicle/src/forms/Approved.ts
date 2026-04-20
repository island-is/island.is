import {
  buildForm,
  buildCustomField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  conclusion,
  externalData,
  information,
  payment,
  review,
} from '../lib/messages'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
  logo: TransportAuthorityLogo,
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
      id: 'confirmation',
      title: conclusion.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'review',
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
