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
              id: 'summary',
              title: 'Samantekt',
              component: 'SummaryNoEdit',
            }),
            buildSubmitField({
              id: 'summarySubmit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.EDIT,
                  name: 'Uppfæra umsókn',
                  type: 'signGhost',
                },
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Áfram í undirritun',
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
