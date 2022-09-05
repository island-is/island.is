import {
  FirearmProperty,
  LicenseAndPropertyInfo,
} from '@island.is/clients/firearm-license'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'

export const parseFirearmLicensePayload = (
  license: LicenseAndPropertyInfo,
): GenericUserLicensePayload | null => {
  if (!license) return null

  const data: Array<GenericLicenseDataField> = [
    license.name && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Nafn einstaklings',
      value: license.name,
    },
    license.ssn && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Kennitala',
      value: license.ssn,
    },
    license.expirationDate && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Gildistími',
      value: license.expirationDate,
    },
    license.issueDate && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Útgáfudagur',
      value: license.issueDate,
    },
    license.licenseNumber && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Númer skírteinis',
      value: license.licenseNumber,
    },
    license.collectorLicenseExpirationDate && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Gildistími safnaraskírteinis',
    },
    license.address && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Heimilisfang',
      value: license.address,
    },
    license.qualifications && {
      type: GenericLicenseDataFieldType.Group,
      label: 'Réttindaflokkar',
      fields: license.qualifications.split('').map((qualification) => ({
        type: GenericLicenseDataFieldType.Category,
        name: qualification,
        label: 'placeholder text',
      })),
    },
    license.properties && {
      type: GenericLicenseDataFieldType.Group,
      label: 'Skotvopn í eigu leyfishafa',
      fields: (license.properties.properties ?? []).map((property) => ({
        type: GenericLicenseDataFieldType.Category,
        fields: parseProperties(property),
      })),
    },
  ].filter((Boolean as unknown) as ExcludesFalse)

  return {
    data,
    rawData: JSON.stringify(license),
  }
}

type ExcludesFalse = <T>(x: T | null | undefined | false | '') => x is T

const parseProperties = (
  property: FirearmProperty,
): Array<GenericLicenseDataField> | undefined => {
  const mappedProperty = [
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
  license: LicenseAndPropertyInfo,
  nationalId: string,
) => {
  if (!license || !nationalId) return null

  return [
    {
      identifier: 'gildir',
      value: license.expirationDate ?? '',
    },
    {
      identifier: 'nafn',
      value: license.name ?? '',
    },
    {
      identifier: 'kt',
      value: nationalId ?? '',
    },
    {
      identifier: 'heimilisfang',
      value: license.address ?? '',
    },
    {
      identifier: 'postnr.',
      value: 'ekki komið',
    },
    {
      identifier: 'numer',
      value: license.licenseNumber ?? '',
    },
    {
      identifier: 'rettindi',
      value: license.qualifications ?? '',
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
