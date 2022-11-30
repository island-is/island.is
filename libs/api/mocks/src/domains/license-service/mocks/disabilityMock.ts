import { faker } from '@island.is/shared/mocking'
import { GenericLicenseDataField } from '../../../types'
import { MockProps } from './types'

export const mockDisabilityLicense = (
  data: MockProps,
): Array<GenericLicenseDataField> => [
  {
    name: 'Grunnupplýsingar skírteinis',
    type: 'Value',
    label: 'Fullt nafn',
    value: data.name,
  },
  {
    type: 'Value',
    label: 'Útgefandi',
    value: faker.name.title(),
  },
  {
    type: 'Value',
    label: 'Gildir til',
    value: data.expires,
  },
]
