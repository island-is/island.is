import differenceInMinutes from 'date-fns/differenceInMinutes'
import differenceInHours from 'date-fns/differenceInHours'
import differenceInDays from 'date-fns/differenceInDays'
import differenceInYears from 'date-fns/differenceInYears'
import differenceInWeeks from 'date-fns/differenceInWeeks'

import { ApplicationState } from '@island.is/financial-aid/shared/lib'

export const isPluralInIcelandic = (value: number): boolean =>
  value % 10 !== 1 || value % 100 === 11

export const calcDifferenceInDate = (dateCreated: string | undefined) => {
  if (dateCreated) {
    const minutes = differenceInMinutes(new Date(), new Date(dateCreated))
    const hours = differenceInHours(new Date(), new Date(dateCreated))
    const days = differenceInDays(new Date(), new Date(dateCreated))
    const weeks = differenceInWeeks(new Date(), new Date(dateCreated))

    if (minutes < 1) {
      return `Rétt í þessu`
    }
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

export const calcAge = (ssn: string) => {
  const year = ssn.substring(4, 6)
  const significant = ssn.substring(9, 10)

  const birthDay = new Date(
    Number(`${Number(significant) < 8 ? '2' : '1'}${significant}${year}`),
    Number(ssn.substring(2, 4)) - 1,
    Number(ssn.substring(0, 2)),
  )

  return differenceInYears(new Date(), birthDay)
}

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
