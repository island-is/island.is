import { buildSection } from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { childInfoSubSection } from './childInfoSubSection'
import { childrenSubSection } from './childrenSubSection'
import { parentsSubSection } from './parentsSubSection'
import { relativesSubSection } from './relativesSubSection'

export const childrenNParentsSection = buildSection({
  id: 'childrenNParentsSection',
  title: newPrimarySchoolMessages.childrenNParents.sectionTitle,
  children: [
    childrenSubSection,
    childInfoSubSection,
    parentsSubSection,
    relativesSubSection,
  ],
})
