import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { ApproveContract } from '../../../lib/dataSchema'
import { DefaultEvents } from '@island.is/application/types'
import * as m from '../../../lib/messages'

export const rejectContractSection = buildSection({
  condition: (answers) => answers.acceptContract === ApproveContract.No,
  id: 'rejectContract',
  title: m.rejectContract.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'rejectContract',
      title: m.rejectContract.general.pageTitle,
      children: [
        buildCustomField({
          id: 'rejectContract',
          title: m.rejectContract.general.pageTitle,
          component: 'RejectContract',
        }),
        buildSubmitField({
          id: 'reject',
          title: '',
          actions: [
            {
              event: DefaultEvents.REJECT,
              name: m.rejectContract.general.rejectButton,
              type: 'reject',
            },
          ],
        }),
      ],
    }),
  ],
})
