import parse from 'date-fns/parse'
import isValid from 'date-fns/isValid'

export const toValidatedDate = (isoDate: string): Date => {
  if (!isValid(parse(isoDate, 'yyyy-MM-dd', new Date()))) {
    throw new Error(`Invalid date: ${isoDate}`)
  }
  return new Date(isoDate)
}
