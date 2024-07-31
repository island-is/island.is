import { buildCustomField, buildSubSection } from '@island.is/application/core'
import * as m from '../../../lib/messages'

export const approveTermsParentBSubSection = buildSubSection({
  id: 'approveTermsParentB',
  title: m.terms.general.sectionTitle,
  children: [
    buildCustomField({
      id: 'approveTermsParentB',
      title: m.terms.general.pageTitle,
      component: 'Terms',
    }),
  ],
})
