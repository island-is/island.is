import {
  buildForm,
  buildCustomField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { information, externalData, confirmation } from '../lib/messages'

export const Confirmation: Form = buildForm({
  id: 'ConfirmationForm',
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
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [
        buildCustomField({
          component: 'Confirmation',
          id: 'confirmation',
          description: '',
        }),
      ],
    }),
  ],
})
