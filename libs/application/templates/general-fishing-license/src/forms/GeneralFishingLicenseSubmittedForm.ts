import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { Logo } from '../assets'
import { conclusion } from '../lib/messages'

export const GeneralFishingLicenseSubmittedForm: Form = buildForm({
  id: 'GeneralFishingLicenseSubmittedForm',
  title: '',
  logo: Logo,
  children: [
    buildSection({
      id: 'conclusionSection',
      title: conclusion.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'conclusion',
          title: conclusion.general.title,
          children: [
            buildCustomField({
              id: 'conclusionCustomField',
              title: '',
              doesNotRequireAnswer: true,
              component: 'Conclusion',
            }),
          ],
        }),
      ],
    }),
  ],
})
