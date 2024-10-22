import { buildSection } from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { childInfoSubSection } from './childInfoSubSection'
import { parentsSubSection } from './parentsSubSection'
import { relativesSubSection } from './relativesSubSection'

export const childrenNParentsSection = buildSection({
  id: 'childrenNParentsSection',
  title: newPrimarySchoolMessages.childrenNParents.sectionTitle,
  children: [childInfoSubSection, parentsSubSection, relativesSubSection],
})
