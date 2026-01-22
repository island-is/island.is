import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const representativeOverview = [
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewRepresentativeTitle',
    title: m.representativeTitle,
    titleVariant: 'h3',
    marginBottom: 'gutter',
  }),
  buildKeyValueField({
    width: 'half',
    label: m.nationalId,
    value: ({ answers }) =>
      formatNationalId(
        getValueViaPath<string>(answers, 'representative.nationalId') ?? '',
      ),
    condition: (answers) =>
      !!getValueViaPath<string>(answers, 'representative.nationalId'),
  }),
  buildKeyValueField({
    width: 'half',
    label: m.name,
    value: ({ answers }) =>
      getValueViaPath<string>(answers, 'representative.name'),
    condition: (answers) =>
      !!getValueViaPath<string>(answers, 'representative.name'),
  }),
  buildDescriptionField({
    id: 'spaceRepresentative',
    space: 'gutter',
    condition: (answers) =>
      !!getValueViaPath<string>(answers, 'representative.nationalId'),
  }),
  buildKeyValueField({
    width: 'half',
    label: m.phone,
    value: ({ answers }) => {
      const parsedPhoneNumber = parsePhoneNumberFromString(
        getValueViaPath<string>(answers, 'representative.phone') ?? '',
      )
      return formatPhoneNumber(
        parsedPhoneNumber?.nationalNumber?.toString() || '',
      )
    },
    condition: (answers) =>
      !!getValueViaPath<string>(answers, 'representative.phone'),
  }),
  buildKeyValueField({
    width: 'half',
    label: m.email,
    value: ({ answers }) =>
      getValueViaPath<string>(answers, 'representative.email'),
    condition: (answers) =>
      !!getValueViaPath<string>(answers, 'representative.email'),
  }),
  buildDescriptionField({
    id: 'representativeNotFilledOut',
    description: m.notFilledOutItalic,
    condition: (answers) =>
      !getValueViaPath<string>(answers, 'representative.nationalId'),
  }),
]
