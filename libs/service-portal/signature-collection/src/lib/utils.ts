import { Endorsement } from '@island.is/api/schema'
import format from 'date-fns/format'

export const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return date
  }
}

export const PAGE_SIZE = 10

export function paginate(
  petitions: Endorsement[],
  pageSize: number,
  pageNumber: number,
) {
  return petitions.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}

export function pages(petitionsLength: number) {
  return Math.ceil(petitionsLength / PAGE_SIZE)
}

export const mockLists = [
  {
    id: '1',
    name: 'Vestfirðingafjórðungur',
    progress: 40,
  },
  {
    id: '2',
    name: 'Norðlendingafjórðungur',
    progress: 90,
  },
  {
    id: '3',
    name: 'Austfirðingafjórðungur',
    progress: 185,
  },
  {
    id: '4',
    name: 'Sunnlendingafjórðungur',
    progress: 35,
  },
]
