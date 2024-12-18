import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusion } from '../lib/messages'
import { Logo } from '../assets/Logo'

export const Conclusion: Form = buildForm({
  id: 'ConclusionForm',
  title: '',
  logo: Logo,
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'conclusionSection',
      title: conclusion.general.sectionTitle,
      children: [
        buildCustomField({
          component: 'Conclusion',
          id: 'conclusion',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
