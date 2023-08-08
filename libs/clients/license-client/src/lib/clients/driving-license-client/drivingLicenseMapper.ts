import { DriversLicense } from '@island.is/clients/driving-license'
import format from 'date-fns/format'
import { info, format as formatSsn } from 'kennitala'

export const formatNationalId = (nationalId: string) => formatSsn(nationalId)

export const createPkPassDataInput = (
  license?: DriversLicense | null,
  nationalId?: string,
) => {
  if (!license || !nationalId) return null

  return [
    {
      identifier: 'gildir',
      value: license.expires ? format(license.expires, 'dd-MM-yyyy') : '',
    },
    {
      identifier: 'nafn',
      value: license.name ?? '',
    },
    {
      identifier: 'kennitala',
      value: nationalId ? formatSsn(nationalId) : '',
    },
    {
      identifier: 'faedingardagur',
      value: format(info(nationalId ?? '').birthday, 'dd-MM-yyyy'),
    },
    {
      identifier: 'utgafudagur',
      value: license.issued ? format(license.issued, 'dd-MM-yyyy') : '',
    },
    {
      identifier: 'numer',
      value: license.id.toString() ?? '',
    },
    {
      identifier: 'rettindi',
      value: license.categories
        ? license.categories?.reduce((acc, curr) => `${acc} ${curr.name}`, '')
        : '',
    },
    {
      identifier: 'athugasemdir',
      value: license.healthRemarks ? license.healthRemarks.join(' ') : '',
    },
  ]
}
