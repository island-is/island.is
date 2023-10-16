import {
  FirearmProperty,
  FirearmPropertyList,
  LicenseInfo,
} from '@island.is/clients/firearm-license'
import { PassInputFieldValueDataInput } from '@island.is/clients/smartsolutions'
import format from 'date-fns/format'
import { format as formatNationalId } from 'kennitala'

const formatDateString = (dateTime: string) =>
  dateTime ? format(new Date(dateTime), 'dd.MM.yyyy') : ''

const formatPropertyForPkpassInput = (properties?: Array<FirearmProperty>) => {
  if (!properties?.length) return 'Engin skráð skotvopn'

  const propertyString = properties
    .map(
      (property) =>
        `▶︎ ${property.typeOfFirearm} ${property.name}.\nHlaupvídd ${property.caliber}.\nNúmer ${property.serialNumber}.`,
    )
    .join('\n\n')

  return propertyString
}

export const mapNationalId = (
  nationalId: string,
): PassInputFieldValueDataInput => {
  return {
    identifier: 'kt',
    value: nationalId ? formatNationalId(nationalId) : '',
  }
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
      value: licenseInfo.ssn ? formatNationalId(licenseInfo.ssn) : '',
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
        ? formatPropertyForPkpassInput(propertyInfo.properties ?? [])
        : '',
    },
    {
      identifier: 'utgefandi',
      value: 'Lögreglan',
    },
  ]
}
