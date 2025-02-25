import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { application, summary } from '../lib/messages'

export const summaryAssigneeForm: Form = buildForm({
  id: 'summaryAssigneeForm',
  title: application.name,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [
    buildSection({
      id: 'summary',
      title: summary.sectionName,
      children: [
        buildDescriptionField({
          id: 'summaryTitle',
          title: summary.pageTitle,
          marginBottom: 3,
        }),
        buildDescriptionField({
          id: 'summaryFirstDescription',
          title: '',
          description: summary.pageDescriptionFirstParagraph,
        }),
        buildDescriptionField({
          id: 'summarySecondDescription',
          title: '',
          description: summary.pageDescriptionSecondparagraph,
        }),
        buildMultiField({
          id: 'summary',
          title: '',
          children: [
            buildCustomField({
              id: 'summaryComponent',
              title: 'Samantekt',
              component: 'Summary',
            }),
          ],
        }),
      ],
    }),
  ],
})
