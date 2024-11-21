import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'

export const formatDate = (date: string) => {
  return format(parseISO(date), 'dd.MMMM yyyy', {
    locale: is,
  })
}
