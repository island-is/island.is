import {
  DrivingLicenseQualification,
  GenericDrivingLicenseResponse,
} from './genericDrivingLicense.type'
import { format, info } from 'kennitala'

export const createPkPassDataInput = (
  license: GenericDrivingLicenseResponse,
) => {
  if (!license) return null

  return [
    {
      identifier: 'gildir',
      value: license.gildirTil ?? '',
    },
    {
      identifier: 'nafn',
      value: license.nafn ?? '',
    },
    {
      identifier: 'faedingardagur',
      value: license.kennitala
        ? info(license.kennitala).birthday.toISOString()
        : '',
    },
    {
      identifier: 'utgafudagur',
      value: license.utgafuDagsetning ?? '',
    },
    {
      identifier: 'kennitala',
      value: license.kennitala ? format(license.kennitala) : '',
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
