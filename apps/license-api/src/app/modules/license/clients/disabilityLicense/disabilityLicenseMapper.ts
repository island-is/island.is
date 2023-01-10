import format from 'date-fns/format'
import { DisabilityLicenseUpdateData } from './disabilityLicenseClient.types'
const formatDateString = (dateTime: Date) => {
  return dateTime ? format(dateTime, 'dd.MM.yyyy') : ''
}

export const createPkPassDataInput = (license: DisabilityLicenseUpdateData) => {
  if (!license) return null

  return [
    {
      identifier: 'name',
      value: license.nafn ?? '',
    },
    {
      identifier: 'kennitala',
      value: license.kennitala ?? '',
    },
    {
      identifier: 'gildir',
      value: license.gildirTil ? formatDateString(license.gildirTil) : '',
    },
  ]
}
