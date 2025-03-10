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

export const SummaryNoEditForm: Form = buildForm({
  id: 'SummaryNoEditForm',
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
        buildMultiField({
          id: 'summary',
          title: '',
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
            buildCustomField({
              id: 'SummaryNoEdit',
              title: 'Samantekt',
              component: 'SummaryNoEdit',
            }),
          ],
        }),
      ],
    }),
  ],
})
