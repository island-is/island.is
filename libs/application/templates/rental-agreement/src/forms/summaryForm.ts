import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'

import Logo from '../assets/Logo'

import { application, summary } from '../lib/messages'

export const SummaryForm: Form = buildForm({
  id: 'summaryForm',
  title: application.name,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'summary',
      title: summary.sectionName,
      children: [
        buildMultiField({
          id: 'summary',
          children: [
            buildDescriptionField({
              id: 'summaryTitle',
              title: summary.pageTitle,
              marginBottom: 3,
            }),
            buildDescriptionField({
              id: 'summaryFirstDescription',
              description: summary.pageDescriptionFirstParagraph,
            }),
            buildDescriptionField({
              id: 'summarySecondDescription',
              description: summary.pageDescriptionSecondparagraph,
            }),
            buildCustomField({
              id: 'summary',
              title: summary.sectionName,
              component: 'SummaryNoEdit',
            }),
            buildSubmitField({
              id: 'summarySubmit',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.EDIT,
                  name: summary.editButtonLabel,
                  type: 'signGhost',
                },
                {
                  event: DefaultEvents.SUBMIT,
                  name: summary.submitButtonLabel,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
