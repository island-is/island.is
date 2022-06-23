import { VinnuvelaDto } from '@island.is/clients/adr-and-machine-license'
import {
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'

export const parseMachineLicensePayload = (
  license: VinnuvelaDto,
): GenericUserLicensePayload | null => {
  if (!license) return null

  //TODO: Null check fields and filter!

  const data = [
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Skírteini nr. ',
      value: license.skirteinisNumer?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '1. Fullt nafn',
      value: license?.fulltNafn ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '2. Kennitala',
      value: license.kennitala ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '3. Útgáfustaður',
      value: license.utgafuStadur ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '4. Útgáfudagur',
      value: license.fyrstiUtgafuDagur?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '5. Gildir til.',
      value: 'Sjá réttindi',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '6. Ökuskírteini nr',
      value: license.okuskirteinisNumer ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: 'Réttindaflokkar',
      fields: (license.vinnuvelaRettindi ?? []).map((field) => ({
        type: GenericLicenseDataFieldType.Category,
        name: field.flokkur ?? '',
        label: field.fulltHeiti ?? field.stuttHeiti ?? '',
        fields: [
          {
            type: GenericLicenseDataFieldType.Value,
            label: 'Stjórna',
            value: field.stjorna ?? '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: 'Kenna',
            value: field.kenna ?? '',
          },
        ],
      })),
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
  }
}
