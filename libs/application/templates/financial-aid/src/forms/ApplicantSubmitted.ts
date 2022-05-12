import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSubmitField,
  DefaultEvents,
  Form,
} from '@island.is/application/core'

import * as m from '../lib/messages'

export const ApplicantSubmitted: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.status.sectionTitle,
  children: [
    buildMultiField({
      id: 'applicantStatus',
      title: m.status.pageTitle,
      children: [
        buildCustomField({
          id: 'applicantStatus',
          title: m.status.pageTitle,
          component: 'ApplicantStatus',
        }),
        buildSubmitField({
          id: '',
          title: '',
          actions: [],
        }),
      ],
    }),
    buildMultiField({
      id: 'missingFiles',
      title: m.missingFiles.general.pageTitle,
      children: [
        buildCustomField({
          id: 'missingFiles',
          title: m.missingFiles.general.pageTitle,
          component: 'MissingFiles',
        }),
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
      id: 'missingFilesConfirmation',
      title: m.missingFiles.confirmation.title,
      component: 'MissingFilesConfirmation',
    }),
  ],
})
