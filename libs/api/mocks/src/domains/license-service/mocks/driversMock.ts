import { factory, faker } from '@island.is/shared/mocking'
import { GenericLicenseDataField } from '../../../types'
import { MockProps } from './types'
import { maybeExpired, generateDataField } from './utils'

const driversRightsDataField = () =>
  factory<GenericLicenseDataField>({
    type: 'Category',
    name: faker.random.alpha({ count: 1, upcase: true }),
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
        value: faker.random.words(),
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
