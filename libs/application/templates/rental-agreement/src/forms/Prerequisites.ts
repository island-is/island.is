import {
  buildExternalDataProvider,
  buildForm,
  buildSection,
} from '@island.is/application/core'

import { Form, FormModes } from '@island.is/application/types'
import * as m from '../lib/messages'

export const Prerequisites: Form = buildForm({
  id: 'RentalAgreementApplication',
  title: m.application.name,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'externalData',
      title: m.section.information,
      children: [
        buildExternalDataProvider({
          title: 'm.externalData.general.pageTitle',
          id: 'approveExternalData',
          subTitle: 'm.externalData.general.subTitle',
          description: 'm.externalData.general.description',
          checkboxLabel: 'm.externalData.general.checkboxLabel',
          dataProviders: [],
        }),
      ],
    }),
    buildSection({
      id: 'conditions',
      title: m.section.information,
      children: [],
    }),
  ],
})
