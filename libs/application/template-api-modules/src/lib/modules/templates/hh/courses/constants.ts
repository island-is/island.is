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
          displayedTitle
          startDateTimeDuration {
            startTime
            endTime
          }
          maxRegistrations
          chargeItemCode
          location
          description
        }
      }
    }
  }
`

export const GET_CHARGE_ITEM_CODES_BY_COURSE_ID_QUERY = `
  query GetChargeItemCodesByCourseId($input: GetChargeItemCodesByCourseIdInput!) {
    getChargeItemCodesByCourseId(input: $input) {
      items {
        code
        priceAmount
      }
    }
  }
`

export const COURSE_LIST_PAGE_SLUG_MAP: Record<string, string> = {
  '6pkONOn80xzGTGij6qtjai': 'namskeid-fyrir-almenning',
  '147YftiWFQsBcbUFFe2rj1': 'namskeid-fyrir-fagfolk',
}

export const ZENDESK_CUSTOM_OBJECT_KEYS = {
  course: 'hh_course',
  courseInstance: 'hh_course_instance',
  courseParticipant: 'hh_course_participant',
} as const

export const ZENDESK_TICKET_IDS = {
  brandId: 46016159517467,
  ticketFormId: 46207982902171,
  customFields: {
    courseTitle: 46207894385307,
    applicantName: 46214558377627,
    startDate: 46207912615963,
    location: 48052528916763,
    courseUrl: 47332926605979,
  },
} as const
