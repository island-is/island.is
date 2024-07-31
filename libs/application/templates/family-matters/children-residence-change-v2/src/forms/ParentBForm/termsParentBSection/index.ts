import { buildSection } from '@island.is/application/core'
import { ApproveContract } from '../../../lib/dataSchema'
import * as m from '../../../lib/messages'
import { approveTermsParentBSubSection } from './approveTermsParentBSubSection'
import { approveChildSupportTermsParentBSubSection } from './approveChildSupportTermsParentBSubSection'

export const termsParentBSection = buildSection({
  condition: (answers) => answers.acceptContract === ApproveContract.Yes,
  id: 'termsParentB',
  title: m.section.effect,
  children: [
    approveTermsParentBSubSection,
    approveChildSupportTermsParentBSubSection,
  ],
})
