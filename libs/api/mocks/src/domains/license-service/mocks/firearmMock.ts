import { factory, faker } from '@island.is/shared/mocking'
import { GenericLicenseDataField } from '../../../types'
import { MockProps } from './types'
import { generateDataField, maybeExpired } from './utils'

const firearmPropertyDataField = () =>
  factory<GenericLicenseDataField>({
    type: 'Category',
    fields: [
      {
        type: 'Value',
        label: 'Staða skotvopns',
        value: faker.random.word(),
      },
      {
        type: 'Value',
        label: 'Tegund',
        value: faker.random.word(),
      },
      {
        type: 'Value',
        label: 'Heiti',
        value: faker.random.word(),
      },
      {
        type: 'Value',
        label: 'Númer',
        value: faker.datatype.number(1000000000).toString(),
      },
      {
        type: 'Value',
        label: 'Landsnúmer',
        value: faker.datatype.number(99999999).toString(),
      },
      {
        type: 'Value',
        label: 'Hlaupvídd',
        value: faker.datatype.number(50).toString(),
      },
      {
        type: 'Value',
        label: 'Takmarkanir',
        value: faker.random.word(),
      },
    ],
  })

const firearmRightsDataField = () =>
  factory<GenericLicenseDataField>({
    type: 'Category',
    name: faker.random.alpha({ count: 1, upcase: true }),
    label: faker.random.word(),
    description: faker.lorem.paragraph(),
    value: '',
  })

export const mockFirearmLicense = (
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
    label: 'Full nafn',
    value: data.name,
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
    type: 'Value',
    label: 'Safnaraskírteini gildir til',
    value: maybeExpired(),
  },
  {
    type: 'Group',
    label: 'Réttindaflokkar',
    fields: generateDataField(
      firearmRightsDataField,
      faker.datatype.number(10),
    ),
  },
  {
    type: 'Table',
    label: 'Skotvopn í eigu leyfishafa',
    fields: faker.datatype.boolean()
      ? generateDataField(firearmPropertyDataField, faker.datatype.number(250))
      : [],
  },
]
