import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'

import * as m from '../lib/messages'

export const MuncipalityNotRegistered: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.REJECTED,
  children: [
    buildSection({
      id: 'muncipalityNotRegistered',
      title: m.serviceCenter.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'serviceCenter',
          title: m.serviceCenter.general.pageTitle,
          component: 'ServiceCenter',
        }),
      ],
    }),
  ],
})
