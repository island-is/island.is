import * as kennitala from 'kennitala'

import { GenericDrivingLicenseResponse } from './genericDrivingLicense.type'
import {
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'

export const parseDrivingLicensePayload = (
  licenses: GenericDrivingLicenseResponse[],
): GenericUserLicensePayload | null => {
  if (licenses.length === 0) {
    return null
  }

  // Only handling the first driving license, we get them ordered so pick first
  const license = licenses[0]
  const birthday = license.kennitala
    ? kennitala.info(license.kennitala).birthday
    : ''

  // Parse license data into the fields as they're displayed on the physical drivers license
  // see: https://www.samgongustofa.is/umferd/nam-og-rettindi/skirteini-og-rettindi/okurettindi-og-skirteini/
  const data = [
    // We don't get the name split into two from the API, combine
    {
      type: GenericLicenseDataFieldType.Value,
      label: '2. Eiginnafn 1. Kenninafn',
      value: license.nafn,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '3. Fæðingardagur og fæðingarstaður',
      value: [
        birthday ? new Date(birthday).toISOString() : null,
        license.faedingarStadurHeiti ?? null,
      ]
        .filter(Boolean)
        .join(' '),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '4a. Útgáfudagur',
      value: license.utgafuDagsetning
        ? new Date(license.utgafuDagsetning).toISOString()
        : '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      name: 'gildirTil',
      label: '4b. Lokadagur',
      value: license.gildirTil ? new Date(license.gildirTil).toISOString() : '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '4c. Nafn útgefanda',
      value: license.nafnUtgafustadur,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '4d. Kennitala',
      value: license.kennitala,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '5. Númer',
      name: 'skirteinisNumer',
      value: (license?.id ?? '').toString(),
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: '9. Réttindaflokkar',
      fields: (license.rettindi ?? []).map((field) => ({
        type: GenericLicenseDataFieldType.Category,
        name: (field.nr ?? '').trim(),
        label: (field.nr ?? '').trim(),
        fields: [
          {
            type: GenericLicenseDataFieldType.Value,
            label: 'Lokadagur',
            value: field.gildirTil
              ? new Date(field.gildirTil).toISOString()
              : '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: 'Útgáfudagur',
            value: field.utgafuDags
              ? new Date(field.utgafuDags).toISOString()
              : '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: 'Athugasemd',
            value: field.aths,
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
