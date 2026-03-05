export const GET_COURSE_BY_ID_QUERY = `
  query GetCourseById($input: GetCourseByIdInput!) {
    getCourseById(input: $input) {
      course {
        id
        title
        courseListPageId
        instances {
          id
          startDate
          startDateTimeDuration {
            startTime
            endTime
          }
          maxRegistrations
          chargeItemCode
          location
        }
      }
    }
  }
`

export const COURSE_LIST_PAGE_SLUG_MAP: Record<string, string> = {
  '6pkONOn80xzGTGij6qtjai': 'namskeid-fyrir-almenning',
  '147YftiWFQsBcbUFFe2rj1': 'namskeid-fyrir-fagfolk',
}
