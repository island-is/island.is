import { OldGenericDrivingLicenseResponse } from './oldGenericDrivingLicense.type'
import {
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import { getLabel } from '../../utils/translations'

type ExcludesFalse = <T>(x: T | null | undefined | false | '') => x is T

export const parseDrivingLicensePayload = (
  licenses: OldGenericDrivingLicenseResponse[],
  locale: Locale = 'is',
  labels: GenericLicenseLabels,
): GenericUserLicensePayload | null => {
  if (licenses.length === 0) {
    return null
  }

  // Only handling the first driving license, we get them ordered so pick first
  const license = licenses[0]
  const expired = license.gildirTil
    ? !isAfter(new Date(license.gildirTil), new Date())
    : null

  const label = labels?.labels

  // Parse license data into the fields as they're displayed on the physical drivers license
  // see: https://www.samgongustofa.is/umferd/nam-og-rettindi/skirteini-og-rettindi/okurettindi-og-skirteini/
  const data = [
    // We don't get the name split into two from the API, combine
    {
      name: getLabel('basicInfoLicense', locale, label),
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('licenseNumber', locale, label),
      value: (license?.id ?? '').toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('fullName', locale, label),
      value: license.nafn,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('publisher', locale, label),
      value: license.nafnUtgafustadur,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('publishedDate', locale, label),
      value: license.utgafuDagsetning
        ? new Date(license.utgafuDagsetning).toISOString()
        : '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('validTo', locale, label),
      value: license.gildirTil ? new Date(license.gildirTil).toISOString() : '',
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: getLabel('classesOfRights', locale, label),
      fields: (license.rettindi ?? []).map((field) => ({
        type: GenericLicenseDataFieldType.Category,
        name: (field.nr ?? '').trim(),
        label: '',
        fields: [
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('expiryDate', locale, label),
            value: field.gildirTil
              ? new Date(field.gildirTil).toISOString()
              : '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('publishedDate', locale, label),
            value: field.utgafuDags
              ? new Date(field.utgafuDags).toISOString()
              : '',
          },
          field.aths && {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('comment', locale, label),
            value: field.aths,
          },
        ].filter(Boolean as unknown as ExcludesFalse),
      })),
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
    metadata: {
      licenseNumber: license.id?.toString() ?? '',
      expired,
      expireDate: license.gildirTil ?? undefined,
      links: [
        {
          label: getLabel('renewDrivingLicense', locale, label),
          value: 'https://island.is/endurnyjun-okuskirteina',
        },
      ],
    },
  }
}
