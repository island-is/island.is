import {
  buildCustomField,
  buildForm,
  buildSection,
  buildSubSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import { ExternalData } from '../lib/types'

import * as m from '../lib/messages'

export const Application: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'aboutForm',
      title: m.aboutForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'acceptContract',
          title: m.aboutForm.general.pageTitle,
          component: 'AboutForm',
        }),
      ],
    }),
    buildSection({
      condition: (_, externalData) =>
        ((externalData as unknown) as ExternalData).nationalRegistry?.data
          ?.spouse !== undefined,
      id: 'personalInterest',
      title: m.section.personalInterest,
      children: [
        buildSubSection({
          title: m.inRelationship.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'inRelationship',
              title: m.inRelationship.general.pageTitle,
              component: 'InRelationship',
            }),
          ],
        }),
      ],
    }),
  ],
})
