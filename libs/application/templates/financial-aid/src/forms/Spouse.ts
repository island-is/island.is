import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'

import * as m from '../lib/messages'

export const Spouse: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'aboutSpouseForm',
      title: m.aboutSpouseForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'aboutSpouseForm',
          title: m.aboutSpouseForm.general.pageTitle,
          component: 'AboutSpouseForm',
        }),
      ],
    }),
  ],
})
