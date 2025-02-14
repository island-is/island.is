import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { getEstateMembersDescriptionText } from '../../lib/utils'

export const estateMembers = buildSection({
  id: 'estateMembersInfo',
  title: m.estateMembers,
  children: [
    buildMultiField({
      id: 'estateMembersInfo',
      title: m.estateMembers,
      description: (application) =>
        getEstateMembersDescriptionText(application),
      children: [
        buildCustomField({
          id: 'estate.estateMembers',
          component: 'EstateMembersRepeater',
        }),
        buildDescriptionField({
          id: 'spaceEstatesMembers',
          space: 'containerGutter',
        }),
      ],
    }),
  ],
})
