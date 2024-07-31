import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import Logo from '@island.is/application/templates/family-matters-core/assets/Logo'
import * as m from '../lib/messages'

export const ParentBApplicationConfirmation: Form = buildForm({
  id: 'ParentBApplicationConfirmation',
  title: m.application.name,
  logo: Logo,
  children: [
    buildSection({
      id: 'submitted',
      title: m.section.received,
      children: [
        buildCustomField({
          id: 'parentBConfirmation',
          title: m.parentBConfirmation.general.pageTitle,
          component: 'ParentBConfirmation',
        }),
      ],
    }),
  ],
})
