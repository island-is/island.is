import { buildSection } from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { approveTermsSubSection } from './approveTermsSubSection'
import { approveChildSupportTermsSubSection } from './approveChildSupportTermsSubSection'

export const approveTermsSection = buildSection({
  id: 'approveTerms',
  title: m.section.effect,
  children: [approveTermsSubSection, approveChildSupportTermsSubSection],
})
