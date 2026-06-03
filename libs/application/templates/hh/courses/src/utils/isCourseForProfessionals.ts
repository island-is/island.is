import { getValueViaPath } from '@island.is/application/core'
import { getCachedCourseListPageId } from './loadOptions'
import { parseQueryParamValue } from './parseQueryParamValue'
import { COURSE_LIST_PAGE_ID_FOR_PROFESSIONALS } from './constants'

export const isCourseForProfessionals = (
  answers: Record<string, unknown>,
): boolean => {
  // The course category is carried in the initial query params (set when the
  // user opens the application from a course on the external web). This is the
  // most reliable source since it is available from the prerequisites step
  // onwards, before the course-select dropdown has loaded.
  const initialQuery = getValueViaPath<string>(answers, 'initialQuery', '')
  const courseListPageIdFromQuery =
    parseQueryParamValue(initialQuery)?.courseListPageId
  if (courseListPageIdFromQuery) {
    return courseListPageIdFromQuery === COURSE_LIST_PAGE_ID_FOR_PROFESSIONALS
  }

  // Fallback: derive from the selected course via the client-side cache that is
  // populated once the course-select/date dropdown has loaded.
  const courseId = getValueViaPath<string>(answers, 'courseSelect', '')
  return (
    getCachedCourseListPageId(courseId) ===
    COURSE_LIST_PAGE_ID_FOR_PROFESSIONALS
  )
}
