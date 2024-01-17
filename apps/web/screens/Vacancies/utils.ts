import { VacancyListItem } from '@island.is/web/graphql/schema'

export const VACANCY_INTRO_MAX_LENGTH = 80

export const sortVacancyList = (vacancyList: VacancyListItem[]) => {
  vacancyList.sort((a, b) => {
    if (!a?.applicationDeadlineFrom && b?.applicationDeadlineFrom) {
      return 1
    }
    if (a?.applicationDeadlineFrom && !b?.applicationDeadlineFrom) {
      return -1
    }
    if (!a?.applicationDeadlineFrom || !b?.applicationDeadlineFrom) {
      return 0
    }

    const [dayA, monthA, yearA] = a.applicationDeadlineFrom.split('.')
    if (!dayA || !monthA || !yearA) return 0

    const [dayB, monthB, yearB] = b.applicationDeadlineFrom.split('.')
    if (!dayB || !monthB || !yearB) return 0

    const dateA = new Date(Number(yearA), Number(monthA), Number(dayA))
    const dateB = new Date(Number(yearB), Number(monthB), Number(dayB))

    if (dateA < dateB) {
      return 1
    }
    if (dateA > dateB) {
      return -1
    }

    return 0
  })
}
