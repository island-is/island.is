import { buildCustomField, buildSubSection } from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { contactInfoIds } from '../../../fields/ContactInfo'

export const contactSubSection = buildSubSection({
  id: 'contact',
  title: m.contactInfo.general.sectionTitle,
  children: [
    buildCustomField({
      id: 'contactInfo',
      title: m.contactInfo.general.pageTitle,
      childInputIds: contactInfoIds,
      component: 'ContactInfo',
    }),
  ],
})
