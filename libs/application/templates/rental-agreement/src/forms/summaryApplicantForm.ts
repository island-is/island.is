import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'

import Logo from '../assets/Logo'

import { application, summary } from '../lib/messages'

export const summaryApplicantForm: Form = buildForm({
  id: 'summaryApplicantForm',
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
            buildCustomField({
              id: 'summaryComponent',
              title: 'Samantekt',
              component: 'Summary',
            }),
            buildSubmitField({
              id: 'toDraft',
              title: '',
              actions: [
                {
                  event: DefaultEvents.EDIT,
                  name: 'Uppfæra umsókn',
                  type: 'signGhost',
                },
              ],
            }),
            buildSubmitField({
              id: 'toSigning',
              title: '',
              actions: [
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
