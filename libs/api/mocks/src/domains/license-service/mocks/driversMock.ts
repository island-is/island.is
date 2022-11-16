import { factory, faker } from '@island.is/shared/mocking'
import { GenericLicenseDataField } from '../../../types'
import { MockProps } from './types'
import { maybeExpired, generateDataField } from './utils'

const qualifications = [
  'A',
  'AM',
  'A1',
  'A2',
  'B',
  'BE',
  'Ba',
  'Bff',
  'C',
  'CE',
  'C1',
  'C1E',
  'Ca',
  'C1A',
  'D',
  'DE',
  'D1',
  'D1E',
  'Da',
  'D1a',
  'T',
  'other',
]

const driversRightsDataField = () =>
  factory<GenericLicenseDataField>({
    type: 'Category',
    name: faker.random.arrayElement(qualifications),
    fields: [
      {
        type: 'Value',
        label: 'Lokadagur',
        value: maybeExpired(),
      },
      {
        type: 'Value',
        label: 'Útgáfudagur',
        value: faker.date.past().toISOString(),
      },
      {
        type: 'Value',
        label: 'Athugasemd',
        value: faker.datatype.boolean() ? faker.random.words() : '',
      },
    ],
  })

export const mockDriversLicense = (
  data: MockProps,
): Array<GenericLicenseDataField> => [
  {
    name: 'Grunnupplýsingar skírteinis',
    type: 'Value',
    label: 'Númer skírteinis',
    value: data.number,
  },
  {
    type: 'Value',
    label: 'Fullt nafn',
    value: data.name,
  },
  {
    type: 'Value',
    label: 'Útgáfustaður',
    value: faker.address.city(),
  },
  {
    type: 'Value',
    label: 'Útgáfudagur',
    value: faker.date.past().toISOString(),
  },
  {
    type: 'Value',
    label: 'Gildir til',
    value: data.expires,
  },
  {
    type: 'Group',
    label: 'Réttindaflokkar',
    fields: generateDataField(
      driversRightsDataField,
      faker.datatype.number(10),
    ),
  },
]
