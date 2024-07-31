import { buildCustomField, buildSubSection } from '@island.is/application/core'
import * as m from '../../../lib/messages'

export const approveChildSupportTermsParentBSubSection = buildSubSection({
  id: 'approveChildSupportTermsParentB',
  title: m.childSupport.general.sectionTitle,
  children: [
    buildCustomField({
      id: 'approveChildSupportTermsParentB',
      title: m.childSupport.general.pageTitle,
      component: 'ChildSupport',
    }),
  ],
})
