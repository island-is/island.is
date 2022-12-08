import { factory, faker } from '@island.is/shared/mocking'
import { GenericLicenseDataField } from '../../../types'
import { generateDataField } from './utils'

const adrRightsDataField = () =>
  factory<GenericLicenseDataField>({
    type: 'Category',
    name: faker.random.alpha({ count: 1, upcase: true }),
    label: faker.lorem.lines(),
    description: faker.lorem.lines(),
  })

export const mockAdrLicense = (data: {
  number: string
  name: string
  expires: string
}): Array<GenericLicenseDataField> => {
  return [
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
      label: 'Útgefandi',
      value: 'Vinnueftirlitið',
    },
    {
      type: 'Value',
      label: 'Gildir til',
      value: data.expires,
    },
    {
      type: 'Group',
      label: 'Tankar',
      fields: generateDataField(adrRightsDataField, faker.datatype.number(10)),
    },
    {
      type: 'Group',
      label: 'Annað en tankar',
      fields: generateDataField(adrRightsDataField, faker.datatype.number(10)),
    },
  ]
}
