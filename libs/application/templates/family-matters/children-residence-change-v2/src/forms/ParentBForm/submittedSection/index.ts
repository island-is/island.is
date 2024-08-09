import { buildCustomField, buildSection } from '@island.is/application/core'
import { ApproveContract } from '../../../lib/dataSchema'
import * as m from '../../../lib/messages'

export const submittedSection = buildSection({
  condition: (answers) => answers.acceptContract === ApproveContract.Yes,
  id: 'submitted',
  title: m.section.received,
  children: [
    buildCustomField({
      id: 'parentBConfirmation',
      title: m.parentBConfirmation.general.pageTitle,
      component: 'ParentBConfirmation',
    }),
  ],
})
