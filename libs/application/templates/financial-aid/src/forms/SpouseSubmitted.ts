import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import { Application, DefaultEvents, Form } from '@island.is/application/types'
import { Routes } from '../lib/constants'

import * as m from '../lib/messages'
import { createElement } from 'react'
import { Logo } from '../components/Logo/Logo'

export const SpouseSubmitted: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.status.sectionTitle,
  logo: (application: Application) => {
    const logo = createElement(Logo, { application })
    return () => logo
  },
  children: [
    buildMultiField({
      id: Routes.SPOUSESTATUS,
      title: m.status.pageTitle,
      children: [
        buildCustomField({
          id: Routes.SPOUSESTATUS,
          title: m.status.spousePageTitle,
          component: 'SpouseStatus',
        }),
        // Empty submit field to hide all buttons in the footer
        buildSubmitField({
          id: '',
          actions: [],
        }),
      ],
    }),
    buildMultiField({
      id: Routes.MISSINGFILES,
      title: m.missingFiles.general.pageTitle,
      children: [
        buildCustomField(
          {
            id: Routes.MISSINGFILES,
            title: m.missingFiles.general.pageTitle,
            component: 'MissingFiles',
          },
          { isSpouse: true },
        ),
        buildSubmitField({
          id: 'missingFilesSubmit',
          actions: [
            {
              event: DefaultEvents.EDIT,
              name: m.missingFiles.general.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
    buildCustomField({
      id: Routes.MISSINGFILESCONFIRMATION,
      title: m.missingFiles.confirmation.title,
      component: 'MissingFilesConfirmation',
    }),
  ],
})
