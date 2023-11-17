import {
  buildDescriptionField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import format from 'date-fns/format'
import { format as formatNationalId } from 'kennitala'
import { isEstateInfo } from '../../lib/utils/isEstateInfo'

export const deceased = buildSection({
  id: 'deceasedInfo',
  title: m.irSubmitTitle,
  children: [
    buildMultiField({
      id: 'deceasedInfo',
      title: m.irSubmitTitle,
      description: m.irSubmitSubtitle,
      children: [
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
              ? formatNationalId(data?.estate.nationalIdOfDeceased)
              : '',
          width: 'half',
        }),
        buildDescriptionField({
          id: 'space',
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
      ],
    }),
  ],
})
