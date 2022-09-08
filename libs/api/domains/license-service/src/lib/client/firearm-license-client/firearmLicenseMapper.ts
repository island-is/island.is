import {
  FirearmProperty,
  LicenseData,
  LicenseInfo,
} from '@island.is/clients/firearm-license'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'

const ExtractDateString = (dateTime: string) =>
  dateTime ? new Date(dateTime).toISOString().split('T')[0] : null

export const parseFirearmLicensePayload = (
  licenseData: LicenseData,
): GenericUserLicensePayload | null => {
  const { licenseInfo, properties, categories } = licenseData

  if (!licenseInfo) return null

  const data: Array<GenericLicenseDataField> = [
    licenseInfo.name && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Nafn einstaklings',
      value: licenseInfo.name,
    },
    licenseInfo.ssn && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Kennitala',
      value: licenseInfo.ssn,
    },
    licenseInfo.expirationDate && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Gildistími',
      value: ExtractDateString(licenseInfo.expirationDate) ?? '',
    },
    licenseInfo.issueDate && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Útgáfudagur',
      value: ExtractDateString(licenseInfo.issueDate) ?? '',
    },
    licenseInfo.licenseNumber && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Númer skírteinis',
      value: licenseInfo.licenseNumber,
    },
    licenseInfo.collectorLicenseExpirationDate && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Gildistími safnaraskírteinis',
      value:
        ExtractDateString(licenseInfo.collectorLicenseExpirationDate) ?? '',
    },
    licenseInfo.address && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Heimilisfang',
      value: licenseInfo.address,
    },
    licenseInfo.qualifications && {
      type: GenericLicenseDataFieldType.Group,
      label: 'Réttindaflokkar',
      fields: licenseInfo.qualifications.split('').map((qualification) => ({
        type: GenericLicenseDataFieldType.Category,
        name: qualification,
        label: categories?.[`Flokkur ${qualification}`] ?? '',
      })),
    },
    properties && {
      type: GenericLicenseDataFieldType.Group,
      label: 'Skotvopn í eigu leyfishafa',
      fields: (properties.properties ?? []).map((property) => ({
        type: GenericLicenseDataFieldType.Category,
        fields: parseProperties(property)?.filter(
          (Boolean as unknown) as ExcludesFalse,
        ),
      })),
    },
  ].filter((Boolean as unknown) as ExcludesFalse)

  return {
    data,
    rawData: JSON.stringify(licenseData),
  }
}

type ExcludesFalse = <T>(x: T | null | undefined | false | '') => x is T

const parseProperties = (
  property?: FirearmProperty,
): Array<GenericLicenseDataField> | null => {
  if (!property) return null

  const mappedProperty = [
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Staða skotvopns',
      value: property.category ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Tegund',
      value: property.typeOfFirearm ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Heiti',
      value: property.name ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Númer',
      value: property.serialNumber ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Hlaupvídd',
      value: property.caliber ?? '',
    },
  ]
  return mappedProperty
}

export const createPkPassDataInput = (
  licenseInfo?: LicenseInfo | null,
  nationalId?: string,
) => {
  if (!licenseInfo || !nationalId) return null

  return [
    {
      identifier: 'gildir',
      value: licenseInfo.expirationDate ?? '',
    },
    {
      identifier: 'nafn',
      value: licenseInfo.name ?? '',
    },
    {
      identifier: 'kt',
      value: nationalId ?? '',
    },
    {
      identifier: 'heimilisfang',
      value: licenseInfo.address ?? '',
    },
    {
      identifier: 'postnr.',
      value: 'ekki komið',
    },
    {
      identifier: 'numer',
      value: licenseInfo.licenseNumber ?? '',
    },
    {
      identifier: 'rettindi',
      value: licenseInfo.qualifications ?? '',
    },
    {
      identifier: 'skotvopn',
      value: 'placeholder',
    },
    {
      identifier: 'utgefandi',
      value: 'Lögreglan',
    },
  ]
}
