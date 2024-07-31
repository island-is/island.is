import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import Logo from '@island.is/application/templates/family-matters-core/assets/Logo'
import * as m from '../lib/messages'

export const ApplicationApproved: Form = buildForm({
  id: 'ApplicationApproved',
  title: m.application.name,
  logo: Logo,
  children: [
    buildSection({
      id: 'approved',
      title: m.section.received,
      children: [
        buildCustomField({
          id: 'applicationApproved',
          title: m.approved.general.pageTitle,
          component: 'Approved',
        }),
      ],
    }),
  ],
})
