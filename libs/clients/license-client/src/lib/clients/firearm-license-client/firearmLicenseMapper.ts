import {
  FirearmProperty,
  FirearmPropertyList,
  LicenseInfo,
} from '@island.is/clients/firearm-license'
import format from 'date-fns/format'
import { format as formatSsn } from 'kennitala'

export const formatNationalId = (nationalId: string) => formatSsn(nationalId)

const formatDateString = (dateTime: string) =>
  dateTime ? format(new Date(dateTime), 'dd.MM.yyyy') : ''

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

export const nationalIdIndex = 'kt'

export const mapNationalId = (nationalId: string) => {
  return {
    identifier: nationalIdIndex,
    value: nationalId ? formatSsn(nationalId) : '',
  }
}

export const createPkPassDataInput = (
  licenseInfo?: LicenseInfo | null,
  propertyInfo?: FirearmPropertyList | null,
  nationalId?: string,
) => {
  if (!licenseInfo || !licenseInfo.ssn || !nationalId) return null

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
    mapNationalId(licenseInfo.ssn),
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
