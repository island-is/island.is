import { buildSection } from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { childInfoSubSection } from './childInfoSubSection'
import { parentsSubSection } from './parentsSubSection'
import { contactsSubSection } from './contactsSubSection'

export const childrenNParentsSection = buildSection({
  id: 'childrenNParentsSection',
  title: newPrimarySchoolMessages.childrenNParents.sectionTitle,
  children: [childInfoSubSection, parentsSubSection, contactsSubSection],
})
