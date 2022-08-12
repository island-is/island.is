import * as kennitala from 'kennitala'
import { Locale } from '@island.is/shared/types'

import { GenericDrivingLicenseResponse } from './genericDrivingLicense.type'
import {
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import { i18n } from '../../utils/translations'

export const parseDrivingLicensePayload = (
  licenses: GenericDrivingLicenseResponse[],
  locale: Locale = 'is',
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
      label: `2. ${i18n.givenName[locale]} 1. ${i18n.surname[locale]}`,
      value: license.nafn,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: `3. ${i18n.birthdayAndBirthplace[locale]}`,
      value: [
        birthday ? new Date(birthday).toISOString() : null,
        license.faedingarStadurHeiti ?? null,
      ]
        .filter(Boolean)
        .join(' '),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: `4a. ${i18n.publicationDate[locale]}`,
      value: license.utgafuDagsetning
        ? new Date(license.utgafuDagsetning).toISOString()
        : '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      name: 'gildirTil',
      label: `4b. ${i18n.expiryDate[locale]}`,
      value: license.gildirTil ? new Date(license.gildirTil).toISOString() : '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: `4c. ${i18n.publisherName[locale]}`,
      value: license.nafnUtgafustadur,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: `4d. ${i18n.ssn[locale]}`,
      value: license.kennitala,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: `5. ${i18n.licenseNumber[locale]}`,
      name: 'skirteinisNumer',
      value: (license?.id ?? '').toString(),
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: `9. ${i18n.classesOfRights[locale]}`,
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
            label: i18n.publicationDate[locale],
            value: field.utgafuDags
              ? new Date(field.utgafuDags).toISOString()
              : '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: i18n.comment[locale],
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
