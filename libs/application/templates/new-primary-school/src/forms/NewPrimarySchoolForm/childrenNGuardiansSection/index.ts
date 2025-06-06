import { buildSection } from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { childInfoSubSection } from './childInfoSubSection'
import { guardiansSubSection } from './guardiansSubSection'
import { relativesSubSection } from './relativesSubSection'

export const childrenNGuardiansSection = buildSection({
  id: 'childrenNGuardiansSection',
  title: newPrimarySchoolMessages.childrenNGuardians.sectionTitle,
  children: [childInfoSubSection, guardiansSubSection, relativesSubSection],
})
