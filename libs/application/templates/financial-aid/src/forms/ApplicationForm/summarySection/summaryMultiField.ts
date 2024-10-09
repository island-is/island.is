import {
  buildCustomField,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const summaryMultiField = buildMultiField({
  id: Routes.SUMMARY,
  title: m.summaryForm.general.pageTitle,
  children: [
    buildCustomField({
      id: Routes.SUMMARY,
      title: m.summaryForm.general.pageTitle,
      component: 'SummaryForm',
    }),
    buildSubmitField({
      id: 'submitApplication',
      title: '',
      actions: [
        {
          event: DefaultEvents.SUBMIT,
          name: m.summaryForm.general.submit,
          type: 'primary',
        },
      ],
    }),
  ],
})
