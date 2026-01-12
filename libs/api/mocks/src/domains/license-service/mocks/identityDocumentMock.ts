import { faker } from '@island.is/shared/mocking'
import { GenericLicenseDataField } from '../../../types'
import { MockProps } from './types'

export const mockIdentityDocumentLicense = (
  data: MockProps,
): Array<GenericLicenseDataField> => [
  {
    type: 'Value',
    label: 'Fullt nafn',
    value: data.name,
  },
  {
    type: 'Value',
    label: 'Númer',
    value: data.number,
    link: {
      label: 'Afrita',
      type: 'Copy',
    },
  },
  {
    type: 'Value',
    label: 'Útgáfudagur',
    value: faker.date.past().toISOString(),
  },
  {
    type: 'Value',
    label: 'Lokadagur',
    value: data.expires,
  },
  {
    type: 'Value',
    label: 'Nafn á tölvulesanlegu formi',
    value: data.name.toUpperCase(),
  },
  {
    type: 'Value',
    label: 'Kyn',
    value: 'Kona',
  },
]
