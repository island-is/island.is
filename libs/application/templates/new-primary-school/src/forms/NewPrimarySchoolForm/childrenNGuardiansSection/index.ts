import { buildSection } from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { childInfoSubSection } from './childInfoSubSection'
import { guardiansSubSection } from './guardiansSubSection'
import { contactsSubSection } from './contactsSubSection'

export const childrenNGuardiansSection = buildSection({
  id: 'childrenNGuardiansSection',
  title: newPrimarySchoolMessages.childrenNGuardians.sectionTitle,
  children: [childInfoSubSection, guardiansSubSection, contactsSubSection],
})
