import {
  buildForm,
  buildSection,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'

import * as m from '../lib/messages'

export const WaitingForSpouse: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'Stuff TODO',
      title: 'TODO stuff',
      children: [
        buildTextField({
          id: 'Todo-text-field',
          title: 'Waiting-for-spouse',
        }),
      ],
    }),
  ],
})
