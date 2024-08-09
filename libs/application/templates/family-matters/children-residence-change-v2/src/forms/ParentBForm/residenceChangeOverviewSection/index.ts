import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { ApproveContract } from '../../../lib/dataSchema'
import { DefaultEvents } from '@island.is/application/types'
import * as m from '../../../lib/messages'

export const residenceChangeOverviewSection = buildSection({
  condition: (answers) => answers.acceptContract === ApproveContract.Yes,
  id: 'residenceChangeOverview',
  title: m.section.overview,
  children: [
    buildMultiField({
      id: 'confirmContractParentB',
      title: m.contract.general.pageTitle,
      children: [
        buildCustomField({
          id: 'confirmContractParentB',
          title: m.contract.general.pageTitle,
          component: 'Overview',
        }),
        buildSubmitField({
          id: 'submit',
          title: '',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.application.confirm,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
