import {
  FirearmProperty,
  FirearmPropertyList,
  LicenseInfo,
} from '@island.is/clients/firearm-license'
import isAfter from 'date-fns/isAfter'
import format from 'date-fns/format'
import { format as formatSsn } from 'kennitala'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import { Locale } from '@island.is/shared/types'
import { i18n } from '../../utils/translations'
import { LicenseData } from './firearmLicense.type'

const formatDateString = (dateTime: string) =>
  dateTime ? format(new Date(dateTime), 'dd.MM.yyyy') : ''

export const parseFirearmLicensePayload = (
  licenseData: LicenseData,
  locale: Locale = 'is',
  labels: GenericLicenseLabels,
): GenericUserLicensePayload | null => {
  const { licenseInfo, properties, categories } = licenseData

  const expired = licenseInfo?.expirationDate
    ? !isAfter(new Date(licenseInfo.expirationDate), new Date())
    : null
  if (!licenseInfo) return null

  const label = labels.labels
  const data: Array<GenericLicenseDataField> = [
    licenseInfo.licenseNumber && {
      name: 'Grunnupplýsingar skotvopnaleyfis',
      type: GenericLicenseDataFieldType.Value,
      label: label ? label['licenseNumber'] : i18n.licenseNumber[locale],
      value: licenseInfo.licenseNumber,
    },
    licenseInfo.name && {
      type: GenericLicenseDataFieldType.Value,
      label: label ? label['fullName'] : i18n.fullName[locale],
      value: licenseInfo.name,
    },
    licenseInfo.issueDate && {
      type: GenericLicenseDataFieldType.Value,
      label: label ? label['publishedDate'] : i18n.publishedDate[locale],
      value: licenseInfo.issueDate ?? '',
    },
    licenseInfo.expirationDate && {
      type: GenericLicenseDataFieldType.Value,
      label: label ? label['validTo'] : i18n.validTo[locale],
      value: licenseInfo.expirationDate ?? '',
    },
    licenseInfo.collectorLicenseExpirationDate && {
      type: GenericLicenseDataFieldType.Value,
      label: label
        ? label['collectorLicenseValidTo']
        : i18n.collectorLicenseValidTo[locale],
      value: licenseInfo.collectorLicenseExpirationDate ?? '',
    },

    licenseInfo.qualifications && {
      type: GenericLicenseDataFieldType.Group,
      label: label ? label['classesOfRights'] : i18n.classesOfRights[locale],
      fields: licenseInfo.qualifications.split('').map((qualification) => ({
        type: GenericLicenseDataFieldType.Category,
        name: qualification,
        label:
          categories?.[
            `${
              label ? label['category'] : i18n.category[locale]
            } ${qualification}`
          ] ?? '',
        description:
          categories?.[
            `${
              label ? label['category'] : i18n.category[locale]
            } ${qualification}`
          ] ?? '',
      })),
    },
    properties && {
      type: GenericLicenseDataFieldType.Group,
      hideFromServicePortal: true,
      label: label
        ? label['firearmProperties']
        : i18n.firearmProperties[locale],
      fields: (properties.properties ?? []).map((property) => ({
        type: GenericLicenseDataFieldType.Category,
        fields: parseProperties(labels, property, locale)?.filter(
          (Boolean as unknown) as ExcludesFalse,
        ),
      })),
    },
    properties && {
      type: GenericLicenseDataFieldType.Table,
      label: label
        ? label['firearmProperties']
        : i18n.firearmProperties[locale],
      fields: (properties.properties ?? []).map((property) => ({
        type: GenericLicenseDataFieldType.Category,
        fields: parseProperties(labels, property, locale)?.filter(
          (Boolean as unknown) as ExcludesFalse,
        ),
      })),
    },
  ].filter((Boolean as unknown) as ExcludesFalse)

  return {
    data,
    rawData: JSON.stringify(licenseData),
    metadata: {
      licenseNumber: licenseData.licenseInfo?.licenseNumber?.toString() ?? '',
      expired,
      expireDate: licenseData.licenseInfo?.expirationDate ?? undefined,
      links: [
        {
          label: label
            ? label['renewFirearmLicense']
            : i18n.renewFirearmLicense[locale],
          value: 'https://island.is/skotvopnaleyfi',
        },
      ],
    },
  }
}

type ExcludesFalse = <T>(x: T | null | undefined | false | '') => x is T

const parseProperties = (
  labels: GenericLicenseLabels,
  property?: FirearmProperty,
  locale: Locale = 'is',
): Array<GenericLicenseDataField> | null => {
  if (!property) return null
  const label = labels.labels
  const mappedProperty = [
    {
      type: GenericLicenseDataFieldType.Value,
      label: label ? label['firearmStatus'] : i18n.firearmStatus[locale],
      value: property.category ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: label ? label['type'] : i18n.type[locale],
      value: property.typeOfFirearm ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: label ? label['name'] : i18n.name[locale],
      value: property.name ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: label ? label['number'] : i18n.number[locale],
      value: property.serialNumber ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: label ? label['countryNumber'] : i18n.countryNumber[locale],
      value: property.landsnumer ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: label ? label['caliber'] : i18n.caliber[locale],
      value: property.caliber ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: label ? label['limitation'] : i18n.limitation[locale],
      value: property.limitation ?? '',
    },
  ]
  return mappedProperty
}

const parsePropertyForPkpassInput = (properties?: Array<FirearmProperty>) => {
  if (!properties?.length) return 'Engin skráð skotvopn'

  const propertyString = properties
    .map(
      (property) =>
        `▶︎ ${property.typeOfFirearm} ${property.name}.\r\nHlaupvídd ${property.caliber}.\r\nNúmer ${property.serialNumber}.`,
    )
    .join('\r\n\r\n')

  return propertyString
}

export const createPkPassDataInput = (
  licenseInfo?: LicenseInfo | null,
  propertyInfo?: FirearmPropertyList | null,
  nationalId?: string,
) => {
  if (!licenseInfo || !nationalId) return null

  const parseAddress = (address?: string) => {
    if (!address) return

    const splitArray = address.split(',')
    return {
      address: splitArray[0] ? splitArray[0].trim() : '',
      zip: splitArray[1] ? splitArray[1].trim() : '',
    }
  }

  const parsedAddress = parseAddress(licenseInfo.address ?? '')

  return [
    {
      identifier: 'gildir',
      value: licenseInfo.expirationDate
        ? formatDateString(licenseInfo.expirationDate)
        : '',
    },
    {
      identifier: 'nafn',
      value: licenseInfo.name ?? '',
    },
    {
      identifier: 'kt',
      value: licenseInfo.ssn ? formatSsn(licenseInfo.ssn) : '',
    },
    {
      identifier: 'heimilisfang',
      value: parsedAddress?.address ?? '',
    },
    {
      identifier: 'postnr.',
      value: parsedAddress?.zip ?? '',
    },
    {
      identifier: 'numer',
      value: licenseInfo.licenseNumber ?? '',
    },
    {
      identifier: 'rettindi',
      value: licenseInfo.qualifications
        ? licenseInfo.qualifications.split('').join(' ')
        : '',
    },
    {
      identifier: 'skotvopn',
      value: propertyInfo
        ? parsePropertyForPkpassInput(propertyInfo.properties ?? [])
        : '',
    },
    {
      identifier: 'utgefandi',
      value: 'Lögreglan',
    },
  ]
}
