import { factory, faker } from '@island.is/shared/mocking'
import { GenericLicenseDataField } from '../../../types'
import { MockProps } from './types'
import { generateDataField, maybeExpired } from './utils'

const machineRightsDataField = () => {
  const fields = new Array<GenericLicenseDataField>()

  const canTeach = faker.datatype.boolean()

  fields.push({
    type: 'Value',
    label: 'Stjórna',
    value: maybeExpired(),
  })

  if (canTeach) {
    fields.push({
      type: 'Value',
      label: 'Kenna',
      value: maybeExpired(),
    })
  }

  return factory<GenericLicenseDataField>({
    type: 'Category',
    name: faker.string.alpha({ casing: 'upper' }),
    label: faker.word.words({ count: { min: 1, max: 5 } }),
    description: faker.word.words({ count: { min: 1, max: 5 } }),
    fields: fields,
  })
}

export const mockMachineLicense = (
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
    label: 'Gildir til',
    value: data.expires,
  },
  {
    type: 'Group',
    label: 'Réttindaflokkar',
    fields: generateDataField(machineRightsDataField, faker.number.int(10)),
  },
]
