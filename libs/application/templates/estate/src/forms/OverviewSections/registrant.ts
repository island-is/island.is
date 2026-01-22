import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { EstateTypes } from '../../lib/constants'

export const registrantOverviewFields = [
  buildDividerField({
    condition: (answers) =>
      getValueViaPath<string>(answers, 'selectedEstate') ===
      EstateTypes.permitForUndividedEstate,
  }),
  buildDescriptionField({
    id: 'overviewRegistrantHeader',
    title: m.registrantTitle,
    titleVariant: 'h3',
    space: 'gutter',
    marginBottom: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'selectedEstate') ===
      EstateTypes.permitForUndividedEstate,
  }),
  buildKeyValueField({
    label: m.name,
    value: ({ answers }) => getValueViaPath<string>(answers, 'registrant.name'),
    width: 'half',
    marginBottom: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'selectedEstate') ===
      EstateTypes.permitForUndividedEstate,
  }),
  buildKeyValueField({
    label: m.nationalId,
    value: ({ answers }) =>
      formatNationalId(
        getValueViaPath<string>(answers, 'registrant.nationalId') ?? '',
      ),
    width: 'half',
    marginBottom: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'selectedEstate') ===
      EstateTypes.permitForUndividedEstate,
  }),
  buildKeyValueField({
    label: m.address,
    value: ({ answers }) =>
      getValueViaPath<string>(answers, 'registrant.address'),
    width: 'half',
    marginBottom: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'selectedEstate') ===
      EstateTypes.permitForUndividedEstate,
  }),
  buildKeyValueField({
    label: m.phone,
    value: ({ answers }) => {
      const phone = getValueViaPath<string>(answers, 'registrant.phone') ?? ''
      return formatPhoneNumber(phone)
    },
    width: 'half',
    marginBottom: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'selectedEstate') ===
      EstateTypes.permitForUndividedEstate,
  }),
  buildKeyValueField({
    label: m.email,
    value: ({ answers }) =>
      getValueViaPath<string>(answers, 'registrant.email'),
    width: 'half',
    marginBottom: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'selectedEstate') ===
      EstateTypes.permitForUndividedEstate,
  }),
  buildKeyValueField({
    label: m.applicantRelation,
    value: ({ answers }) =>
      getValueViaPath<string>(answers, 'registrant.relation'),
    width: 'half',
    marginBottom: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'selectedEstate') ===
      EstateTypes.permitForUndividedEstate,
  }),
  // buildDescriptionField({
  //   id: 'spaceRegistrant',
  //   condition: (answers) =>
  //     getValueViaPath<string>(answers, 'selectedEstate') ===
  //     EstateTypes.permitForUndividedEstate,
  // }),
]
