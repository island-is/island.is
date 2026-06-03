import { isCourseForProfessionals } from './isCourseForProfessionals'
import { COURSE_LIST_PAGE_ID_FOR_PROFESSIONALS } from './constants'
import { getCachedCourseListPageId } from './loadOptions'

jest.mock('./loadOptions', () => ({
  getCachedCourseListPageId: jest.fn(),
}))

const mockedGetCachedCourseListPageId =
  getCachedCourseListPageId as jest.MockedFunction<
    typeof getCachedCourseListPageId
  >

const PUBLIC_COURSE_LIST_PAGE_ID = '6pkONOn80xzGTGij6qtjai'

const initialQueryWith = (courseListPageId?: string) =>
  JSON.stringify({
    courseId: 'course-1',
    courseInstanceId: 'instance-1',
    ...(courseListPageId ? { courseListPageId } : {}),
  })

describe('isCourseForProfessionals', () => {
  beforeEach(() => {
    mockedGetCachedCourseListPageId.mockReset()
  })

  describe('from initial query params (preferred source)', () => {
    it('returns true for a professional course', () => {
      const answers = {
        initialQuery: initialQueryWith(COURSE_LIST_PAGE_ID_FOR_PROFESSIONALS),
      }
      expect(isCourseForProfessionals(answers)).toBe(true)
      expect(mockedGetCachedCourseListPageId).not.toHaveBeenCalled()
    })

    it('returns false for a public course', () => {
      const answers = {
        initialQuery: initialQueryWith(PUBLIC_COURSE_LIST_PAGE_ID),
      }
      expect(isCourseForProfessionals(answers)).toBe(false)
      expect(mockedGetCachedCourseListPageId).not.toHaveBeenCalled()
    })
  })

  describe('fallback to the client-side cache', () => {
    it('uses the cached course list page id when the param is absent', () => {
      mockedGetCachedCourseListPageId.mockReturnValue(
        COURSE_LIST_PAGE_ID_FOR_PROFESSIONALS,
      )
      const answers = {
        initialQuery: initialQueryWith(),
        courseSelect: 'course-1',
      }
      expect(isCourseForProfessionals(answers)).toBe(true)
      expect(mockedGetCachedCourseListPageId).toHaveBeenCalledWith('course-1')
    })

    it('returns false when neither the param nor the cache identify a professional course', () => {
      mockedGetCachedCourseListPageId.mockReturnValue(null)
      expect(isCourseForProfessionals({})).toBe(false)
    })
  })
})
