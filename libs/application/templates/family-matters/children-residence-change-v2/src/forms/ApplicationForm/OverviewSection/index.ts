import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import * as m from '../../../lib/messages'
import { confirmContractIds } from '../../../fields/Overview'

export const overviewSection = buildSection({
  id: 'overview',
  title: m.section.overview,
  children: [
    buildMultiField({
      id: 'confirmContract',
      title: m.contract.general.pageTitle,
      children: [
        buildCustomField({
          id: 'confirmContract',
          title: m.contract.general.pageTitle,
          childInputIds: confirmContractIds,
          component: 'Overview',
        }),
        buildSubmitField({
          id: 'assign',
          title: '',
          actions: [
            {
              event: DefaultEvents.ASSIGN,
              name: m.application.confirm,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
