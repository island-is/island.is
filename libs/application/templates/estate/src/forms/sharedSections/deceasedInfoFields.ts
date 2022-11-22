import {
  buildDescriptionField,
  buildKeyValueField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import format from 'date-fns/format'
import { isEstateInfo } from '../../lib/utils/isEstateInfo'
import { format as formatKennitala } from 'kennitala'

export const deceasedInfoFields = [
  buildKeyValueField({
    label: m.nameOfTheDeceased,
    value: ({
      externalData: {
        syslumennOnEntry: { data },
      },
    }) => (isEstateInfo(data) ? data.estate.nameOfDeceased : ''),
    width: 'half',
  }),
  buildKeyValueField({
    label: m.nationalId,
    value: ({
      externalData: {
        syslumennOnEntry: { data },
      },
    }) =>
      isEstateInfo(data)
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
    value: ({
      externalData: {
        syslumennOnEntry: { data },
      },
    }) => (isEstateInfo(data) ? data.estate.addressOfDeceased : ''),
    width: 'half',
  }),
  buildKeyValueField({
    label: m.deathDate,
    value: ({
      externalData: {
        syslumennOnEntry: { data },
      },
    }) =>
      isEstateInfo(data)
        ? format(new Date(data.estate.dateOfDeath), 'dd/MM/yyyy')
        : m.deathDateNotRegistered,
    width: 'half',
  }),
]
