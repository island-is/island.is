import {
  buildDescriptionField,
  buildKeyValueField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import format from 'date-fns/format'
import { isEstateRegistrant } from '../../lib/utils/isEstateRegistrant'
import { format as formatKennitala } from 'kennitala'
export const deceasedInfoFields = [
  buildKeyValueField({
    label: m.nameOfTheDeceased,
    value: ({
      externalData: {
        syslumennOnEntry: { data },
      },
    }) => (isEstateRegistrant(data) ? data.estate.nameOfDeceased : ''),
    width: 'half',
  }),
  buildKeyValueField({
    label: m.nationalId,
    value: ({
      externalData: {
        syslumennOnEntry: { data },
      },
    }) =>
      isEstateRegistrant(data)
        ? formatKennitala(data.estate.nationalIdOfDeceased)
        : '',
    width: 'half',
  }),
  buildDescriptionField({
    id: 'spaceDIF',
    space: 'gutter',
    title: '',
  }),
  buildKeyValueField({
    label: m.address,
    value: 'La la Land 123', // TODO: address this with API about getting lögheimili
    width: 'half',
  }),
  buildKeyValueField({
    label: m.deathDate,
    value: ({
      externalData: {
        syslumennOnEntry: { data },
      },
    }) =>
      isEstateRegistrant(data)
        ? format(new Date(data.estate.dateOfDeath), 'dd/MM/yyyy')
        : m.deathDateNotRegistered,
    width: 'half',
  }),
]
