import format from 'date-fns/format'
import { OrorkuSkirteini } from '@island.is/clients/disability-license'

const formatDateString = (dateTime: Date) => {
  return dateTime ? format(dateTime, 'dd.MM.yyyy') : ''
}

export const createPkPassDataInput = (license: OrorkuSkirteini) => {
  if (!license) return null

  return [
    {
      identifier: 'nafn',
      value: license.nafn ?? '',
    },
    {
      identifier: 'kennitala',
      value: license.kennitala ?? '',
    },
    {
      identifier: 'gildir',
      value: license.gildirtil ? formatDateString(license.gildirtil) : '',
    },
  ]
}
