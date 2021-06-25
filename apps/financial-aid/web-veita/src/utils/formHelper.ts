import differenceInMinutes from 'date-fns/differenceInMinutes'
import differenceInHours from 'date-fns/differenceInHours'
import differenceInDays from 'date-fns/differenceInDays'
import differenceInYears from 'date-fns/differenceInYears'
import { ApplicationState } from '@island.is/financial-aid/shared'

export const calcDifferenceInDate = (dateCreated: string | undefined) => {
  if (dateCreated) {
    const minutes = differenceInMinutes(new Date(), new Date(dateCreated))

    if (minutes < 60) {
      return `${minutes} min`
    }
    // Todo: fix rest
    if (differenceInHours(new Date(), new Date(dateCreated)) < 24) {
      return differenceInHours(new Date(), new Date(dateCreated)) + ' klst'
    }

    // Todo: check if it ends with 1 lol
    return differenceInDays(new Date(), new Date(dateCreated)) + ' dagar'
  }
}

// Todo use int
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

  return months[parseInt(mon) - 1]
}

export const calcAge = (ssn: string) => {
  const year = ssn.substring(4, 6)
  const significant = ssn.substring(9, 10)

  let birthDay = new Date(
    Number(`${Number(significant) < 8 ? '2' : '1'}${significant}${year}`),
    Number(ssn.substring(2, 4)) - 1,
    Number(ssn.substring(0, 2)),
  )

  return differenceInYears(new Date(), birthDay)
}

export const getFileType = (fileName: string) => {
  // Todo: hande no file type?

  return fileName.substring(fileName.lastIndexOf('.') + 1)
}

// Navigation items?
export const navigationElements = [
  {
    label: 'Ný mál',
    link: '/nymal',
    applicationState: [ApplicationState.NEW],
    headers: ['Nafn', 'Staða', 'Tími án umsjár', 'Tímabil'],
  },
  {
    label: 'Mál í vinnslu',
    link: '/vinnslu',
    applicationState: [ApplicationState.INPROGRESS],
    headers: ['Nafn', 'Staða', 'Síðast uppfært', 'Tímabil'],
  },
  {
    label: 'Afgreidd mál',
    link: '/afgreidd',
    applicationState: [ApplicationState.APPROVED, ApplicationState.REJECTED],
    headers: ['Nafn', 'Staða', 'Úrlausnartími', 'Tímabil'],
  },
]

export const getTagByState = (state: ApplicationState) => {
  switch (state) {
    case ApplicationState.NEW:
      return 'new'
    case ApplicationState.INPROGRESS:
      return 'processing'
    case ApplicationState.APPROVED:
      return 'approved'
    case ApplicationState.REJECTED:
      return 'outDatedOrDenied'
  }
}
