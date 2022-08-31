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
      label: 'Nafn',
      value: license.name,
    },
    license.ssn && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Kennitala',
      value: license.ssn,
    },
    license.issueDate && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Útgáfudagur',
      value: license.issueDate,
    },
    license.expirationDate && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Gildir til',
      value: license.expirationDate,
    },
    license.licenseNumber && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Númer skotvopnaleyfis',
      value: license.licenseNumber,
    },
    license.address && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Heimilisfang',
      value: license.address,
    },
    license.qualifications && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Réttindaflokkar',
      value: license.qualifications,
    },
    license.properties && {
      type: GenericLicenseDataFieldType.Group,
      label: 'Skotvopn',
      fields: (license.properties.properties ?? []).map((property) => ({
        type: GenericLicenseDataFieldType.Category,
        name: 'Staða skotvopns',
        label: property.category ?? '',
        fields: parseProperties(property),
      })),
    },
    license.licenseImgBase64 && {
      type: GenericLicenseDataFieldType.Value,
      label: 'Mynd',
      value: license.licenseImgBase64,
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
      name: 'Tegund',
      value: property.typeOfFirearm ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      name: 'Númer',
      value: property.serialNumber ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      name: 'Hlaupvídd',
      value: property.caliber ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      name: 'Heiti',
      value: property.name ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      name: 'Landsnúmer',
      value: property.landsnumer ?? '',
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
