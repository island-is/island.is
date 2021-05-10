import {
  buildForm,
  buildSection,
  Form,
  buildCustomField,
} from '@island.is/application/core'
import Logo from '../../../assets/Logo'
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
