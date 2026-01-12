import {
  buildForm,
  buildCustomField,
  buildSection,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  information,
  externalData,
  payment,
  conclusion,
  review,
} from '../lib/messages'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'

export const Rejected: Form = buildForm({
  id: 'RejectedApplicationForm',
  logo: TransportAuthorityLogo,
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
      id: 'conclusion',
      title: conclusion.general.rejectedTitle,
      children: [
        buildMultiField({
          id: 'conclusion.multifield',
          title: conclusion.general.rejectedTitle,
          children: [
            buildCustomField({
              component: 'RejectedConclusion',
              id: 'RejectedConclusion',
              description: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
