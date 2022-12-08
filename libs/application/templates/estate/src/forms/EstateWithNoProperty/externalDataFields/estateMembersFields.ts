import {
  buildCustomField,
  buildDescriptionField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { Application } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { EstateMember, EstateRegistrant } from '@island.is/clients/syslumenn'

export const estateMembersFields = [
  buildDescriptionField({
    id: 'estateMembersHeader',
    title: m.estateMembers,
    titleVariant: 'h3',
  }),
  buildCustomField(
    {
      title: '',
      id: 'estateMembersCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ externalData }: Application) =>
        (
          (externalData.syslumennOnEntry.data as { estate: EstateRegistrant })
            ?.estate.estateMembers ?? []
        ).map((member: EstateMember) => ({
          title: member.name,
          description: [formatNationalId(member.nationalId), member.relation],
        })),
    },
  ),
]
