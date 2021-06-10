import differenceInMinutes from 'date-fns/differenceInMinutes'
import differenceInHours from 'date-fns/differenceInHours'
import differenceInDays from 'date-fns/differenceInDays'
import differenceInYears from 'date-fns/differenceInYears'
import { State } from '@island.is/financial-aid/shared'

export const calcDifferenceInDate = (dateCreated: string | undefined) => {
  if (dateCreated) {
    if (differenceInMinutes(new Date(), new Date(dateCreated)) < 60) {
      return differenceInMinutes(new Date(), new Date(dateCreated)) + ' min'
    }
    if (differenceInHours(new Date(), new Date(dateCreated)) < 24) {
      return differenceInHours(new Date(), new Date(dateCreated)) + ' klst'
    } else {
      return differenceInDays(new Date(), new Date(dateCreated)) + ' dagar'
    }
  }
}

export const translateMonth = (mon: string) => {
  const months = [
    'Janúar',
    'Febrúar',
    'Mars',
    'Apríl',
    'Maí',
    'Júní',
    'Júlí',
    'Ágúst',
    'September',
    'Október',
    'Nóvember',
    'Desember',
  ]
  return months.filter((el, i) => i == parseInt(mon) - 1)[0]
}

export const calcAge = (ssn: string) => {
  const year = ssn.substring(4, 6)
  const significant = ssn.substring(9, 10)

  let birtDay = new Date(
    Number(`${Number(significant) < 8 ? '2' : '1'}${significant}${year}`),
    Number(ssn.substring(2, 4)) - 1,
    Number(ssn.substring(0, 2)),
  )

  return differenceInYears(new Date(), birtDay)
}

export const getFileType = (fileName: string) => {
  return fileName.substring(fileName.lastIndexOf('.') + 1)
}

export const navLinks = (
  filterBy?: 'label' | 'link' | 'state',
  filter?: string,
) => {
  const links = [
    {
      label: 'Ný mál',
      link: '/nymal',
      state: State.NEW,
      headers: ['Nafn', 'Staða', 'Tími án umsjár', 'Tímabil'],
    },
    {
      label: 'Í vinnslu',
      link: '/vinnslu',
      state: State.INPROGRESS,
      headers: ['Nafn', 'Staða', 'Síðast uppfært', 'Tímabil'],
    },
    {
      label: 'Afgreidd mál',
      link: '/afgreidd',
      state: State.APPROVED,
      secState: State.REJECTED,
      headers: ['Nafn', 'Staða', 'Úrlausnartími', 'Tímabil'],
    },
  ]
  if (filterBy) {
    return links.filter((i) => i[filterBy] === filter)[0]
  } else {
    return links
  }
}
