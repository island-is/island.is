import { getValueViaPath } from '@island.is/application/core'
import { getCachedCourseListPageId } from './loadOptions'
import { parseQueryParamValue } from './parseQueryParamValue'

export const COURSE_LIST_PAGE_ID_FOR_PROFESSIONALS = '147YftiWFQsBcbUFFe2rj1'

export const isCourseForProfessionals = (
  answers: Record<string, unknown>,
): boolean => {
  const initialQuery = getValueViaPath<string>(answers, 'initialQuery', '')
  const courseListPageIdFromQuery =
    parseQueryParamValue(initialQuery)?.courseListPageId
  if (courseListPageIdFromQuery)
    return courseListPageIdFromQuery === COURSE_LIST_PAGE_ID_FOR_PROFESSIONALS

  const courseId = getValueViaPath<string>(answers, 'courseSelect', '')
  return (
    getCachedCourseListPageId(courseId) ===
    COURSE_LIST_PAGE_ID_FOR_PROFESSIONALS
  )
}
