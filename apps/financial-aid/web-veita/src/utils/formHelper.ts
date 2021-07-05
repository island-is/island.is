import differenceInMinutes from 'date-fns/differenceInMinutes'
import differenceInHours from 'date-fns/differenceInHours'
import differenceInDays from 'date-fns/differenceInDays'
import differenceInYears from 'date-fns/differenceInYears'

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

export const insertAt = (str: string, sub: string, pos: number) =>
  `${str.slice(0, pos)}${sub}${str.slice(pos)}`

export const translateMonth = (mon: number) => {
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
  return months.filter((el, i) => i == mon - 1)[0]
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
