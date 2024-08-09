import { buildCustomField, buildSection } from '@island.is/application/core'
import { contactInfoParentBIds } from '../../../fields/ContactInfoParentB'
import { ApproveContract } from '../../../lib/dataSchema'
import * as m from '../../../lib/messages'

export const contactSection = buildSection({
  condition: (answers) => answers.acceptContract === ApproveContract.Yes,
  id: 'contact',
  title: m.contactInfo.general.sectionTitle,
  children: [
    buildCustomField({
      id: 'contactInfo',
      title: m.contactInfo.general.pageTitle,
      childInputIds: contactInfoParentBIds,
      component: 'ContactInfoParentB',
    }),
  ],
})
