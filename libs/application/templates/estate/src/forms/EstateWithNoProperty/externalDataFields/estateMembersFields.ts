import {
  buildCustomField,
  buildDescriptionField,
  buildKeyValueField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { Application } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'

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
          (externalData.syslumennOnEntry.data as any)?.estate.estateMembers ??
          []
        ).map((member: any) => ({
          title: member.name,
          description: [formatNationalId(member.nationalId), member.relation],
        })),
    },
  ),
  buildDescriptionField({
    id: 'willsHeader',
    title: m.willsAndAgreements,
    titleVariant: 'h3',
    marginBottom: 'gutter',
  }),
  buildKeyValueField({
    label: m.willsInCustody,
    value: 'Já',
    width: 'half',
  }),
  buildKeyValueField({
    label: m.agreements,
    value: 'Nei',
    width: 'half',
  }),
  buildDescriptionField({
    id: 'space',
    title: '',
    space: 'gutter',
  }),
  buildKeyValueField({
    label: m.otherWills,
    value: 'Nei',
    width: 'half',
  }),
]
