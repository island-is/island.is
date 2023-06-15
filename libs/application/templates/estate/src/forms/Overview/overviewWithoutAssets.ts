import {
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { commonOverviewFields } from './commonFields'
import { overviewAttachments } from './overviewAttachments'
import { overviewConfirmAction } from './overviewConfirmAction'

export const overviewWithoutAssets = buildSection({
  id: 'overviewWithoutAssets',
  title: m.overviewTitle,
  children: [
    buildMultiField({
      id: 'overviewWithoutAssets',
      title: m.overviewTitle,
      description: m.overviewSubtitlePermitToPostpone,
      children: [
        ...commonOverviewFields,
        ...overviewAttachments,
        ...overviewConfirmAction,
        buildSubmitField({
          id: 'estateDivisionSubmit.submit',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
