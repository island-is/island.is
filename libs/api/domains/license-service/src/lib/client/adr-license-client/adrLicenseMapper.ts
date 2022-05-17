import { GenericLicenseDataField } from '../../graphql/payload.model'
import {
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import { GenericAdrLicenseResponse } from './genericAdrLicense.type'

export const parseAdrLicensePayload = (
  license: GenericAdrLicenseResponse,
): GenericUserLicensePayload | null => {
  if (!license) return null

  const data = [
    {
      type: GenericLicenseDataFieldType.Value,
      label: '1.',
      name: 'skirteinisNumer',
      value: (license?.skirteinisNumer ?? '').toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      name: 'fulltNafn',
      label: '2. 3.',
      value: license.fulltNafn,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      name: 'faedingardagur',
      label: '4',
      value: license.faedingarDagur,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      name: 'rikisfang',
      label: '5.',
      value: license.rikisfang,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '8. Gildi til: ',
      name: 'gildirTil',
      value: license.gildirTil,
    },
    {
      type: GenericLicenseDataFieldType.Category,
      name: 'rettindiTankar',
      label: 'Tankar 9.',
      fields: (license.adrRettindi ?? [])
        .filter((field) => field.tankar)
        .map((field) => ({
          type: GenericLicenseDataFieldType.Value,
          value: (field.flokkur ?? '').toString(),
        })),
    },
    {
      type: GenericLicenseDataFieldType.Category,
      name: 'rettindiEkkiTankar',
      label: 'Annað en tankar 10.',
      fields: (license.adrRettindi ?? [])
        .filter((field) => !field.tankar)
        .map((field) => ({
          type: GenericLicenseDataFieldType.Value,
          value: (field.flokkur ?? '').toString(),
        })),
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
  }
}
