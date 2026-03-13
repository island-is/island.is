import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import is from 'date-fns/locale/is'

export const formatDate = (date: string) => {
  return format(parseISO(date), 'dd.MM.yyyy', {
    locale: is,
  })
}
