import * as kennitala from 'kennitala'

import { GenericDrivingLicenseResponse } from './genericDrivingLicense.type'
import {
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import isAfter from 'date-fns/isAfter'

type ExcludesFalse = <T>(x: T | null | undefined | false | '') => x is T

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
  const expired = license.gildirTil
    ? !isAfter(new Date(license.gildirTil), new Date())
    : false
  // Parse license data into the fields as they're displayed on the physical drivers license
  // see: https://www.samgongustofa.is/umferd/nam-og-rettindi/skirteini-og-rettindi/okurettindi-og-skirteini/
  const data = [
    // We don't get the name split into two from the API, combine
    {
      name: 'Grunnupplýsingar ökuskírteinis',
      type: GenericLicenseDataFieldType.Value,
      label: 'Númer skírteinis',
      value: (license?.id ?? '').toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Fullt nafn',
      value: license.nafn,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Útgefandi',
      value: license.nafnUtgafustadur,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Útgáfudagur',
      value: license.utgafuDagsetning
        ? new Date(license.utgafuDagsetning).toISOString()
        : '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Gildir til',
      value: license.gildirTil ? new Date(license.gildirTil).toISOString() : '',
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: 'Réttindaflokkar',
      fields: (license.rettindi ?? []).map((field) => ({
        type: GenericLicenseDataFieldType.Category,
        name: (field.nr ?? '').trim(),
        label: '',
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
          field.aths && {
            type: GenericLicenseDataFieldType.Value,
            label: 'Athugasemd',
            value: field.aths,
          },
        ].filter((Boolean as unknown) as ExcludesFalse),
      })),
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
    metadata: {
      licenseNumber: license.id?.toString() ?? '',
      expired,
      links: [
        {
          label: 'Endurnýja ökuskírteini',
          value: 'https://island.is/endurnyjun-okuskirteina',
        },
      ],
    },
  }
}
