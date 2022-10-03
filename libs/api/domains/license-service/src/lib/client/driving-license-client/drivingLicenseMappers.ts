import { GenericDrivingLicenseResponse } from './genericDrivingLicense.type'
import {
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import isAfter from 'date-fns/isAfter'
import { Locale } from '@island.is/shared/types'
import { i18n } from '../../utils/translations'

type ExcludesFalse = <T>(x: T | null | undefined | false | '') => x is T

export const parseDrivingLicensePayload = (
  licenses: GenericDrivingLicenseResponse[],
  locale: Locale = 'is',
): GenericUserLicensePayload | null => {
  if (licenses.length === 0) {
    return null
  }

  // Only handling the first driving license, we get them ordered so pick first
  const license = licenses[0]
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
      label: i18n.licenseNumber[locale],
      value: (license?.id ?? '').toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: i18n.fullName[locale],
      value: license.nafn,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: i18n.publisher[locale],
      value: license.nafnUtgafustadur,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: i18n.publishedDate[locale],
      value: license.utgafuDagsetning
        ? new Date(license.utgafuDagsetning).toISOString()
        : '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: i18n.validTo[locale],
      value: license.gildirTil ? new Date(license.gildirTil).toISOString() : '',
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: i18n.classesOfRights[locale],
      fields: (license.rettindi ?? []).map((field) => ({
        type: GenericLicenseDataFieldType.Category,
        name: (field.nr ?? '').trim(),
        label: '',
        fields: [
          {
            type: GenericLicenseDataFieldType.Value,
            label: i18n.expiryDate[locale],
            value: field.gildirTil
              ? new Date(field.gildirTil).toISOString()
              : '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: i18n.publishedDate[locale],
            value: field.utgafuDags
              ? new Date(field.utgafuDags).toISOString()
              : '',
          },
          field.aths && {
            type: GenericLicenseDataFieldType.Value,
            label: i18n.comment[locale],
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
          label: i18n.renewDrivingLicense[locale],
          value: 'https://island.is/endurnyjun-okuskirteina',
        },
      ],
    },
  }
}
