import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'

export const contactsSubSection = buildSubSection({
  id: 'contactsSubSection',
  title: newPrimarySchoolMessages.childrenNGuardians.contactsSubSectionTitle,
  children: [
    buildMultiField({
      id: 'contacts',
      title: newPrimarySchoolMessages.childrenNGuardians.contactsTitle,
      description:
        newPrimarySchoolMessages.childrenNGuardians.contactsDescription,
      children: [
        buildCustomField({
          id: 'contacts',
          component: 'ContactsTableRepeater',
        }),
      ],
    }),
  ],
})
