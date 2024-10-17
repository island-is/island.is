import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { Routes } from '../../lib/constants'
import { DefaultEvents } from '@island.is/application/types'

export const spouseSummarySection = buildSection({
  id: Routes.SPOUSESUMMARY,
  title: m.summaryForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.SPOUSESUMMARY,
      title: m.summaryForm.general.pageTitle,
      children: [
        buildCustomField({
          id: Routes.SPOUSESUMMARY,
          title: m.summaryForm.general.pageTitle,
          component: 'SpouseSummaryForm',
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
    }),
  ],
})
