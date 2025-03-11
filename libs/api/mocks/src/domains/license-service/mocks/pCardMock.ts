import { faker } from '@island.is/shared/mocking'
import { GenericLicenseDataField } from '../../../types'
import { MockProps } from './types'

export const mockPCardLicense = (
  data: MockProps,
): Array<GenericLicenseDataField> => [
  {
    name: 'Grunnupplýsingar skírteinis',
    type: 'Value',
    label: 'Heiti',
    value: data.name,
  },
  {
    type: 'Value',
    label: 'Kennitala',
    value: '010130-3019',
  },
  {
    type: 'Value',
    label: 'Númer korts',
    value: data.number,
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
    label: 'Útgefandi',
    value: faker.name.title(),
  },
]
