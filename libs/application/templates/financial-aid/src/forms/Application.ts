import {
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'

import * as m from '../lib/messages'

export const Application: Form = buildForm({
  id: 'ApplicantForm',
  title: m.application.name,
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
  ],
})
