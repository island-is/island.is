import { buildCustomField, buildSection } from '@island.is/application/core'
import { ApproveContract } from '../../../lib/dataSchema'
import * as m from '../../../lib/messages'

export const contractRejectedSection = buildSection({
  condition: (answers) => answers.acceptContract === ApproveContract.No,
  id: 'contractRejected',
  title: m.contractRejected.general.sectionTitle.confirmed,
  children: [
    buildCustomField({
      id: 'contractRejected',
      title: m.contractRejected.general.pageTitle,
      component: 'ParentBContractRejected',
    }),
  ],
})
