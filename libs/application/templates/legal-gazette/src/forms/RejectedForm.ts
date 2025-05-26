import {
  buildForm,
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const RejectedForm: Form = buildForm({
  id: 'RejectedForm',
  mode: FormModes.REJECTED,
  children: [
    buildSection({
      id: 'rejected.section',
      title: m.rejected.sectionTitle,
      children: [
        buildMultiField({
          id: 'rejected.form',
          title: m.rejected.formTitle,
          space: 5,
          children: [
            buildDescriptionField({
              id: 'rejected.description',
              description: m.rejected.formIntro,
            }),
            buildCustomField({
              id: 'rejected.createOrOverview',
              component: 'CreateOrOverview',
            }),
          ],
        }),
      ],
    }),
  ],
})
