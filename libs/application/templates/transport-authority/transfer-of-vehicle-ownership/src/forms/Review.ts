import {
  buildForm,
  buildSection,
  buildCustomField,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { information, externalData, payment, conclusion } from '../lib/messages'

export const TransferOfVehicleOwnershipForm: Form = buildForm({
  id: 'TransferOfVehicleOwnershipFormDraft',
  title: '',
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
      id: 'applicationStatus',
      title: payment.general.sectionTitle,
      children: [
        buildCustomField({
          component: 'ApplicationStatus',
          id: 'ApplicationStatus',
          title: '',
          description: '',
        }),
      ],
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
