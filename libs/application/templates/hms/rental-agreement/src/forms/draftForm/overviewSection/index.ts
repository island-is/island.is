import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { Routes } from '../../../utils/enums'
import { buildContractOverviewFields } from '../../shared/contractOverviewFields'
import * as m from '../../../lib/messages'

export const overviewSection = buildSection({
  id: Routes.SUMMARY,
  title: m.overview.pageTitle,
  children: [
    buildMultiField({
      id: Routes.SUMMARY,
      children: [
        buildDescriptionField({
          id: 'summaryTitle',
          title: m.overview.pageTitle,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'summaryFirstDescription',
          description: m.overview.pageDescriptionFirstParagraph,
        }),
        buildDescriptionField({
          id: 'summarySecondDescription',
          description: m.overview.pageDescriptionSecondparagraph,
          marginBottom: 6,
        }),
        ...buildContractOverviewFields({ editable: true }),
        buildSubmitField({
          id: 'toSummary',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.application.goToOverviewButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
