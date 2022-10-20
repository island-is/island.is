import {
  buildDescriptionField,
  buildKeyValueField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const willsAndAgreements = [
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
    id: 'spaceW',
    title: '',
    space: 'gutter',
  }),
  buildKeyValueField({
    label: m.otherWills,
    value: 'Nei',
    width: 'half',
  }),
]
