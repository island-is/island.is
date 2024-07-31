import { buildCustomField, buildSubSection } from '@island.is/application/core'
import * as m from '../../../lib/messages'

export const approveChildSupportTermsSubSection = buildSubSection({
  id: 'approveChildSupportTerms',
  title: m.childSupport.general.sectionTitle,
  children: [
    buildCustomField({
      id: 'approveChildSupportTerms',
      title: m.childSupport.general.pageTitle,
      component: 'ChildSupport',
    }),
  ],
})
