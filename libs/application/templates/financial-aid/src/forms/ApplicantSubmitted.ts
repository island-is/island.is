import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSubmitField,
  DefaultEvents,
  Form,
} from '@island.is/application/core'
import { Routes } from '../lib/constants'

import * as m from '../lib/messages'

export const ApplicantSubmitted: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.status.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.APPLICANTSTATUS,
      title: m.status.pageTitle,
      children: [
        buildCustomField({
          id: Routes.APPLICANTSTATUS,
          title: m.status.pageTitle,
          component: 'ApplicantStatus',
        }),
        // Empty submit field to hide all buttons in the footer
        buildSubmitField({
          id: '',
          title: '',
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
          { isSpouse: false },
        ),
        buildSubmitField({
          id: 'missingFilesSubmit',
          title: '',
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
