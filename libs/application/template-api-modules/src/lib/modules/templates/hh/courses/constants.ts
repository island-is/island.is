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

// Participants and their tickets are each written in a single Zendesk bulk
// job, which is limited to 100 items
export const MAX_PARTICIPANTS_PER_APPLICATION = 92

// Bulk jobs are queued by Zendesk and take 3-5s for the participants and
// 10s+ for the tickets, regardless of size. Direct requests finish in well
// under a second each, so small applications write directly and only large
// ones use the bulk jobs
export const DIRECT_WRITE_MAX_PARTICIPANTS = 10

// Concurrent writes to the same custom object can deadlock in Zendesk, the
// client retries those but keeping the concurrency low avoids most of them
export const PARTICIPANT_WRITE_CONCURRENCY = 3
export const TICKET_CREATE_CONCURRENCY = 5

// Tells participant tickets apart from the registrant ticket
export const ZENDESK_PARTICIPANT_TICKET_TAG = 'hh_course_participant_ticket'

export const ZENDESK_TICKET_IDS = {
  brandId: 46016159517467,
  ticketFormId: 46207982902171,
  customFields: {
    courseTitle: 46207894385307,
    applicantName: 46214558377627,
    startDate: 46207912615963,
    location: 48052528916763,
    courseUrl: 47332926605979,
    // Filled from the ticket text by a Zendesk trigger on registrant tickets,
    // participant tickets set them directly
    phone: 47044944928283,
    email: 48009536643995,
  },
} as const
