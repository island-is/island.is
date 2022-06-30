import {
  buildForm,
  buildSection,
  Form,
  buildCustomField,
} from '@island.is/application/core'
import Logo from '@island.is/application/templates/family-matters-core/assets/Logo'
import * as m from '../lib/messages'

export const ApplicationRejected: Form = buildForm({
  id: 'ApplicationRejected',
  title: m.application.name,
  logo: Logo,
  children: [
    buildSection({
      id: 'rejected',
      title: m.section.rejected,
      children: [
        buildCustomField({
          id: 'ApplicationRejected',
          title: m.rejected.general.pageTitle,
          component: 'Rejected',
        }),
      ],
    }),
  ],
})
