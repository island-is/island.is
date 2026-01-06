import { buildSection } from '@island.is/application/core'
import { childrenNGuardiansMessages } from '../../../lib/messages'
import { childInfoSubSection } from './childInfoSubSection'
import { guardiansSubSection } from './guardiansSubSection'
import { relativesSubSection } from './relativesSubSection'

export const childrenNGuardiansSection = buildSection({
  id: 'childrenNGuardiansSection',
  title: childrenNGuardiansMessages.shared.sectionTitle,
  children: [childInfoSubSection, guardiansSubSection, relativesSubSection],
})
