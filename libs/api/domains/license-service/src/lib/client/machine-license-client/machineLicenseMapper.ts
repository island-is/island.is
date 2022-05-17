import { GenericLicenseDataField } from '../../graphql/payload.model'
import {
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import { GenericMachineLicenseResponse } from './genericMachineLicense.type'

export const parseMachineLicensePayload = (
  license: GenericMachineLicenseResponse,
): GenericUserLicensePayload | null => {
  if (!license) return null
  const data = [
    {
      type: GenericLicenseDataFieldType.Value,
      value: license.skirteinisNumer?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '1. Fullt nafn',
      name: 'full-name',
      value: license?.fulltNafn,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '2. Kennitala',
      value: license.kennitala,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '3. Útgáfustaður',
      value: license.utgafuStadur,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '4. Fyrsti útgáfustaður',
      value: license.fyrstiUtgafuDagur?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '5. Gildir til',
      value: 'Sjá bakhlið',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '6. Ökuskírteini nr.',
      value: license.okuskirteinisNumer,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '7. Útgáfustaður',
      value: license.utgafuLand,
    },
    {
      type: GenericLicenseDataFieldType.Category,
      label: 'Vinnuvélaréttindi',
      fields: (license.vinnuvelaRettindi ?? []).map((field) => [
        {
          type: GenericLicenseDataFieldType.Value,
          label: 'Flokkur',
          value: field.flokkur,
        },
        {
          type: GenericLicenseDataFieldType.Value,
          label: 'Stjórna',
          value: field.stjorna,
        },
        {
          type: GenericLicenseDataFieldType.Value,
          label: 'Kenna',
          value: field.kenna,
        },
        {
          type: GenericLicenseDataFieldType.Value,
          label: 'Fullt heiti',
          value: field.fulltHeiti,
        },
      ]),
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
  }
}
