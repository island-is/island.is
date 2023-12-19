import format from 'date-fns/format'

export const formatDate = (date: Date) => format(date, 'dd.MM.yyyy')
