import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { primarySchoolMessages } from '../../../lib/messages'

export const contactsSubSection = buildSubSection({
  id: 'contactsSubSection',
  title: primarySchoolMessages.childrenNGuardians.contactsSubSectionTitle,
  children: [
    buildMultiField({
      id: 'contacts',
      title: primarySchoolMessages.childrenNGuardians.contactsTitle,
      description: primarySchoolMessages.childrenNGuardians.contactsDescription,
      children: [
        buildCustomField({
          id: 'contacts',
          component: 'ContactsTableRepeater',
        }),
      ],
    }),
  ],
})
