import { buildCustomField, buildSubSection } from '@island.is/application/core'
import * as m from '../../../lib/messages'

export const approveTermsSubSection = buildSubSection({
  id: 'approveTerms',
  title: m.terms.general.sectionTitle,
  children: [
    buildCustomField({
      id: 'approveTerms',
      title: m.terms.general.pageTitle,
      component: 'Terms',
    }),
  ],
})
