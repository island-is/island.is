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
        value: faker.word.sample(),
      },
      {
        type: 'Value',
        label: 'Tegund',
        value: faker.word.sample(),
      },
      {
        type: 'Value',
        label: 'Heiti',
        value: faker.word.sample(),
      },
      {
        type: 'Value',
        label: 'Númer',
        value: faker.number.int(1000000000).toString(),
      },
      {
        type: 'Value',
        label: 'Landsnúmer',
        value: faker.number.int(99999999).toString(),
      },
      {
        type: 'Value',
        label: 'Hlaupvídd',
        value: faker.number.int(50).toString(),
      },
      {
        type: 'Value',
        label: 'Takmarkanir',
        value: faker.word.sample(),
      },
    ],
  })

const firearmRightsDataField = () =>
  factory<GenericLicenseDataField>({
    type: 'Category',
    name: faker.string.alpha({ length: 1, casing: 'upper' }),
    label: faker.word.sample(),
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
    fields: generateDataField(firearmRightsDataField, faker.number.int(10)),
  },
  {
    type: 'Table',
    label: 'Skotvopn í eigu leyfishafa',
    fields: faker.datatype.boolean()
      ? generateDataField(firearmPropertyDataField, faker.number.int(250))
      : [],
  },
]
