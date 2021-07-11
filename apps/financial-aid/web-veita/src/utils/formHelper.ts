import differenceInMinutes from 'date-fns/differenceInMinutes'
import differenceInHours from 'date-fns/differenceInHours'
import differenceInDays from 'date-fns/differenceInDays'
import differenceInYears from 'date-fns/differenceInYears'
import differenceInWeeks from 'date-fns/differenceInWeeks'
import { ApplicationState } from '@island.is/financial-aid/shared'

export const isPluralInIcelandic = (value: number): boolean =>
  value % 10 !== 1 || value % 100 === 11

export const calcDifferenceInDate = (dateCreated: string | undefined) => {
  if (dateCreated) {
    const minutes = differenceInMinutes(new Date(), new Date(dateCreated))
    const hours = differenceInHours(new Date(), new Date(dateCreated))
    const days = differenceInDays(new Date(), new Date(dateCreated))
    const weeks = differenceInWeeks(new Date(), new Date(dateCreated))

    // TODO: add "just now" when under a minute, silly to see 0 minutes.

    if (minutes < 60) {
      return `${minutes} min`
    }

    if (hours < 24) {
      return `${hours} klst`
    }

    if (days < 7) {
      return `${days} ${isPluralInIcelandic(days) ? 'dagar' : 'dagur'}`
    }

    return `${weeks} ${isPluralInIcelandic(weeks) ? 'vikur' : 'vika'}`
  }
}

export const translateMonth = (month: number) => {
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

  return months[month - 1]
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
  // TODO: hande no file type? Handle when files is ready?

  return fileName.substring(fileName.lastIndexOf('.') + 1)
}

// TODO: This is nota a "form function" shoule be somewhere else.
export const navigationItems = [
  {
    label: 'Ný mál',
    link: '/nymal',
    applicationState: [ApplicationState.NEW],
    headers: [
      { title: 'Nafn' },
      { title: 'Staða', filterBy: 'state' },
      { title: 'Tími án umsjár', filterBy: 'modified' },
      { title: 'Tímabil' },
    ],
  },
  {
    label: 'Mál í vinnslu',
    link: '/vinnslu',
    applicationState: [
      ApplicationState.INPROGRESS,
      ApplicationState.DATANEEDED,
    ],
    headers: [
      { title: 'Nafn' },
      { title: 'Staða', filterBy: 'state' },
      { title: 'Síðast uppfært', filterBy: 'modified' },
      { title: 'Tímabil' },
    ],
  },
  {
    label: 'Afgreidd mál',
    link: '/afgreidd',
    applicationState: [ApplicationState.APPROVED, ApplicationState.REJECTED],
    headers: [
      { title: 'Nafn' },
      { title: 'Staða', filterBy: 'state' },
      { title: 'Úrlausnartími', filterBy: 'modified' },
      { title: 'Tímabil' },
    ],
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
    case ApplicationState.DATANEEDED:
      return 'outDatedOrDenied'
  }
}
