import {
  buildDescriptionField,
  buildKeyValueField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import format from 'date-fns/format'
import { format as formatNationalId } from 'kennitala'
import { getEstateDataFromApplication, isEstateInfo } from '../../lib/utils'

export const deceasedInfoFields = [
  buildKeyValueField({
    label: m.nameOfTheDeceased,
    value: (application) => {
      const data = getEstateDataFromApplication(application)
      return isEstateInfo(data) ? data.estate.nameOfDeceased : ''
    },
    width: 'half',
  }),
  buildKeyValueField({
    label: m.nationalId,
    value: (application) => {
      const data = getEstateDataFromApplication(application)
      return isEstateInfo(data)
        ? formatNationalId(data.estate.nationalIdOfDeceased)
        : ''
    },
    width: 'half',
  }),
  buildDescriptionField({
    id: 'spaceDeceased',
    space: 'gutter',
  }),
  buildKeyValueField({
    label: m.address,
    value: (application) => {
      const data = getEstateDataFromApplication(application)
      return isEstateInfo(data) ? data.estate.addressOfDeceased : ''
    },
    width: 'half',
  }),
  buildKeyValueField({
    label: m.deathDate,
    value: (application) => {
      const data = getEstateDataFromApplication(application)
      return isEstateInfo(data)
        ? format(new Date(data.estate.dateOfDeath), 'dd.MM.yyyy')
        : m.deathDateNotRegistered
    },
    width: 'half',
  }),
  buildDescriptionField({
    id: 'spaceDeceased2',
    space: 'gutter',
  }),
]
