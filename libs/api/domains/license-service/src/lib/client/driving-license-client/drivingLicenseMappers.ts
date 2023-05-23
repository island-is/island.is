import {
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import { getLabel } from '../../utils/translations'
import { DriversLicense } from '@island.is/clients/driving-license'
import format from 'date-fns/format'
import { info, format as formatSsn } from 'kennitala'

type ExcludesFalse = <T>(x: T | null | undefined | false | '') => x is T

export const formatNationalId = (nationalId: string) => formatSsn(nationalId)

export const createPkPassDataInput = (
  license?: DriversLicense | null,
  nationalId?: string,
) => {
  if (!license || !nationalId) return null

  return [
    {
      identifier: 'gildir',
      value: license.expires ? format(license.expires, 'dd-MM-yyyy') : '',
    },
    {
      identifier: 'nafn',
      value: license.name ?? '',
    },
    {
      identifier: 'kennitala',
      value: nationalId ? formatSsn(nationalId) : '',
    },
    {
      identifier: 'faedingardagur',
      value: format(info(nationalId ?? '').birthday, 'dd-MM-yyyy'),
    },
    {
      identifier: 'utgafudagur',
      value: license.issued ? format(license.issued, 'dd-MM-yyyy') : '',
    },
    {
      identifier: 'numer',
      value: license.id.toString() ?? '',
    },
    {
      identifier: 'rettindi',
      value: license.categories
        ? license.categories?.reduce((acc, curr) => `${acc} ${curr.name}`, '')
        : '',
    },
    {
      identifier: 'athugasemdir',
      value: license.healthRemarks ? license.healthRemarks.join(' ') : '',
    },
  ]
}

export const parseDrivingLicensePayload = (
  license: DriversLicense,
  locale: Locale = 'is',
  labels: GenericLicenseLabels,
): GenericUserLicensePayload | null => {
  if (!license) {
    return null
  }

  const expired = license.expires
    ? !isAfter(new Date(license.expires), new Date())
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
      value: license.name,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('publisher', locale, label),
      value: '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('publishedDate', locale, label),
      value: license.issued ? new Date(license.issued).toISOString() : '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('validTo', locale, label),
      value: license.expires ? new Date(license.expires).toISOString() : '',
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: getLabel('classesOfRights', locale, label),
      fields: (license.categories ?? []).map((field) => ({
        type: GenericLicenseDataFieldType.Category,
        name: (field.name ?? '').trim(),
        label: '',
        fields: [
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('expiryDate', locale, label),
            value: field.expires ? new Date(field.expires).toISOString() : '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('publishedDate', locale, label),
            value: field.issued ? new Date(field.issued).toISOString() : '',
          },
          field.comments && {
            type: GenericLicenseDataFieldType.Value,
            label: getLabel('comment', locale, label),
            value: field.comments,
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
      expireDate: license.expires?.toISOString() ?? undefined,
      links: [
        {
          label: getLabel('renewDrivingLicense', locale, label),
          value: 'https://island.is/endurnyjun-okuskirteina',
        },
      ],
    },
  }
}
