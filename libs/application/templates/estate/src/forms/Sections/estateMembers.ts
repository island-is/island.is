import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const estateMembers = buildSection({
  id: 'estateMembersInfo',
  title: m.estateMembers,
  children: [
    buildMultiField({
      id: 'estateMembersInfo',
      title: m.estateMembers,
      description: m.estateMembersSubtitle,
      children: [
        buildCustomField({
          title: '',
          id: 'estate.estateMembers',
          component: 'EstateMembersRepeater',
        }),
        buildDescriptionField({
          id: 'spaceEstatesMembers',
          title: '',
          space: 'containerGutter',
        }),
      ],
    }),
  ],
})
