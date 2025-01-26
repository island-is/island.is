import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'

export const contactsSubSection = buildSubSection({
  id: 'contactsSubSection',
  title: newPrimarySchoolMessages.childrenNParents.contactsSubSectionTitle,
  children: [
    buildMultiField({
      id: 'contacts',
      title: newPrimarySchoolMessages.childrenNParents.contactsTitle,
      description:
        newPrimarySchoolMessages.childrenNParents.contactsDescription,
      children: [
        buildCustomField({
          id: 'contacts',
          title: '',
          component: 'ContactsTableRepeater',
        }),
      ],
    }),
  ],
})
