import { GenericDrivingLicenseResponse } from './genericDrivingLicense.type'
import * as kennitala from 'kennitala'
import format from 'date-fns/format'

const formatDateString = (dateTime: string) =>
  dateTime ? format(new Date(dateTime), 'dd-MM-yyyy') : ''

export const createPkPassDataInput = (
  license: GenericDrivingLicenseResponse,
) => {
  if (!license) return null

  return [
    {
      identifier: 'gildir',
      value: license.gildirTil ? formatDateString(license.gildirTil) : '',
    },
    {
      identifier: 'nafn',
      value: license.nafn ?? '',
    },
    {
      identifier: 'faedingardagur',
      value: license.kennitala
        ? formatDateString(
            kennitala.info(license.kennitala).birthday.toISOString(),
          )
        : '',
    },
    {
      identifier: 'utgafudagur',
      value: license.utgafuDagsetning
        ? formatDateString(license.utgafuDagsetning)
        : '',
    },
    {
      identifier: 'kennitala',
      value: license.kennitala ? kennitala.format(license.kennitala) : '',
    },
    {
      identifier: 'numer',
      value: license.id ? license.id.toString() : '',
    },
    {
      identifier: 'rettindi',
      value: license.rettindi
        ? license.rettindi?.reduce((acc, curr) => `${acc} ${curr.nr}`, '')
        : '',
    },
  ]
}
