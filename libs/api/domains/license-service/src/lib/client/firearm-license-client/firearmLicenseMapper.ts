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
import { getLabel } from '../../utils/translations'
import { LicenseData } from './genericFirearmLicense.type'

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
      name: getLabel('basicInfoLicense', locale, label),
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('licenseNumber', locale, label),
      value: licenseInfo.licenseNumber,
    },
    licenseInfo.name && {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('fullName', locale, label),
      value: licenseInfo.name,
    },
    licenseInfo.issueDate && {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('publishedDate', locale, label),
      value: licenseInfo.issueDate ?? '',
    },
    licenseInfo.expirationDate && {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('validTo', locale, label),
      value: licenseInfo.expirationDate ?? '',
    },
    licenseInfo.collectorLicenseExpirationDate && {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('collectorLicenseValidTo', locale, label),
      value: licenseInfo.collectorLicenseExpirationDate ?? '',
    },

    licenseInfo.qualifications && {
      type: GenericLicenseDataFieldType.Group,
      label: getLabel('classesOfRights', locale, label),
      fields: licenseInfo.qualifications.split('').map((qualification) => ({
        type: GenericLicenseDataFieldType.Category,
        name: qualification,
        label:
          categories?.[
            `${getLabel('category', locale, label)} ${qualification}`
          ] ?? '',
        description:
          categories?.[
            `${getLabel('category', locale, label)} ${qualification}`
          ] ?? '',
      })),
    },
    properties && {
      type: GenericLicenseDataFieldType.Group,
      hideFromServicePortal: true,
      label: getLabel('firearmProperties', locale, label),
      fields: (properties.properties ?? []).map((property) => ({
        type: GenericLicenseDataFieldType.Category,
        fields: parseProperties(labels, property, locale)?.filter(
          Boolean as unknown as ExcludesFalse,
        ),
      })),
    },
    properties && {
      type: GenericLicenseDataFieldType.Table,
      label: getLabel('firearmProperties', locale, label),
      fields: (properties.properties ?? []).map((property) => ({
        type: GenericLicenseDataFieldType.Category,
        fields: parseProperties(labels, property, locale)?.filter(
          Boolean as unknown as ExcludesFalse,
        ),
      })),
    },
  ].filter(Boolean as unknown as ExcludesFalse)

  return {
    data,
    rawData: JSON.stringify(licenseData),
    metadata: {
      licenseNumber: licenseData.licenseInfo?.licenseNumber?.toString() ?? '',
      expired,
      expireDate: licenseData.licenseInfo?.expirationDate ?? undefined,
      links: [
        {
          label: getLabel('renewFirearmLicense', locale, label),
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
      label: getLabel('firearmStatus', locale, label),
      value: property.category ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('type', locale, label),
      value: property.typeOfFirearm ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('name', locale, label),
      value: property.name ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('number', locale, label),
      value: property.serialNumber ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('countryNumber', locale, label),
      value: property.landsnumer ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('caliber', locale, label),
      value: property.caliber ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('limitation', locale, label),
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
