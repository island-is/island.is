import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { EstateInfo } from '@island.is/clients/syslumenn'
import { m } from '../../lib/messages'
import { deceasedInfoFields } from '../Sections/deceasedInfoFields'
import { format as formatNationalId } from 'kennitala'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { JA, NEI, YES } from '../../lib/constants'

export const representativeOverview = [
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
    id: 'space4',
    title: '',
    space: 'gutter',
    condition: (answers) =>
      !!getValueViaPath<string>(answers, 'representative.nationalId'),
  }),
  buildKeyValueField({
    width: 'half',
    label: m.phone,
    value: ({ answers }) =>
      formatPhoneNumber(
        getValueViaPath<string>(answers, 'representative.phone') ?? '',
      ),
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
  buildCustomField({
    id: 'representativeNotFilledOut',
    title: '',
    component: 'NotFilledOut',
    condition: (answers) =>
      !getValueViaPath<string>(answers, 'representative.nationalId'),
  }),
  buildDividerField({}),
]
