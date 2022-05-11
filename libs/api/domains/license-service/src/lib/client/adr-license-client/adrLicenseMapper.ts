import { GenericLicenseDataField } from '../../graphql/payload.model'
import {
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import { GenericAdrLicenseResponse } from './genrericAdrLicense.type'

/*
export interface GenericAdrLicenseResponse {
  id?: number
  kennitala?: string
  fulltNafn?: string
  skirteinisNumber?: number
  faedingardagur?: string
  rikisfang?: string
  gildirTil?: string
  adrRettindi?: {
    flokkur?: number
    grunn?: boolean
    tankar: boolean
  }[]
}

export type GenericLicenseDataField = {
  type: GenericLicenseDataFieldType
  name?: string
  label?: string
  value?: string
  fields?: Array<GenericLicenseDataField>
}

export type GenericUserLicensePayload = {
  data: Array<GenericLicenseDataField>
  rawData: unknown
}

export enum GenericLicenseDataFieldType {
  Group = 'Group',
  Category = 'Category',
  Value = 'Value',
}

*/

export const parseAdrLicensePayload = (
  license: GenericAdrLicenseResponse,
): GenericUserLicensePayload | null => {
  if (!license) return null

  const data = [
    {
      type: GenericLicenseDataFieldType.Value,
      label: '1.',
      value: (license?.skirteinisNumber ?? '').toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '2. 3.',
      value: license.fulltNafn,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '4',
      value: license.faedingardagur,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '5.',
      value: license.rikisfang,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '8. Gildi til: ',
      value: license.gildirTil,
    },
    {
      type: GenericLicenseDataFieldType.Category,
      label: 'Tankar 9.',
      fields: (license.adrRettindi ?? [])
        .filter((field) => field.tankar)
        .map((field) => ({
          type: GenericLicenseDataFieldType.Value,
          value: field.flokkur,
        })),
    },
    {
      type: GenericLicenseDataFieldType.Category,
      label: 'Ekki tankar 10.',
      fields: (license.adrRettindi ?? [])
        .filter((field) => !field.tankar)
        .map((field) => ({
          type: GenericLicenseDataFieldType.Value,
          value: field.flokkur,
        })),
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
  }
}
