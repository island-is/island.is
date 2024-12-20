import {
  buildAlertMessageField,
  buildCustomField,
  buildForm,
  buildMultiField,
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
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'conclusionSection',
      title: conclusion.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'conclusionMultiField',
          title: conclusion.overview.pageTitle,
          children: [
            buildAlertMessageField({
              id: 'conclusionAlertMessage',
              alertType: 'info',
              title: conclusion.overview.alertTitle,
              message: conclusion.overview.alertMessage,
            }),
            buildCustomField({
              component: 'Overview',
              id: 'conclusion',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
