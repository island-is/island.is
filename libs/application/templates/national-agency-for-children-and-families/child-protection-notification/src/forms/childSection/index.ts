import { buildSection } from '@island.is/application/core'
import { childMessages } from '../../lib/messages'
import { childInfoManualSubSection } from './childInfoManualSubSection'
import { expectantParentsSubSection } from './expectantParentsSubSection'
import { nationalIdLookupSubSection } from './nationalIdLookupSubSection'

export const childSection = buildSection({
  id: 'childSection',
  title: childMessages.shared.sectionTitle,
  children: [
    nationalIdLookupSubSection,
    childInfoManualSubSection,
    expectantParentsSubSection,
  ],
})
