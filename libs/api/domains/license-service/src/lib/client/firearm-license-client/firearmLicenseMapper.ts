import { LicenseInfo } from '@island.is/clients/firearm-license'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'

const parseField = (
  type: GenericLicenseDataFieldType,
  label: string,
  value: string | null | undefined,
) => {
  if (value) {
    return {
      type: type,
      label: 'Nafn',
      value: value,
    }
  }
  return null
}

export const parseFirearmLicensePayload = (
  license: LicenseInfo,
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
  ].filter((Boolean as unknown) as ExcludesFalse)

  return {
    data,
    rawData: JSON.stringify(license),
  }
}

type ExcludesFalse = <T>(x: T | null | undefined | false | '') => x is T
