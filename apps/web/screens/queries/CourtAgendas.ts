import gql from 'graphql-tag'

export const GET_COURT_AGENDAS_QUERY = gql`
  query GetCourtAgendas($input: WebCourtAgendasInput!) {
    webCourtAgendas(input: $input) {
      items {
        id
        caseNumber
        dateFrom
        dateTo
        closedHearing
        courtRoom
        type
        title
        caseSubType
        judges {
          name
        }
        court
      }
      total
      input {
        page
        dateFrom
        dateTo
        court
        lawyer
        scheduleTypes
        caseTypes
      }
    }
  }
`

export const GET_VERDICT_LAWYERS_QUERY = gql`
  query GetVerdictLawyers {
    webVerdictLawyers {
      lawyers {
        id
        name
      }
    }
  }
`

export const GET_SCHEDULE_TYPES_QUERY = gql`
  query GetScheduleTypes {
    webCourtScheduleTypes {
      courtOfAppeal {
        items {
          id
          label
        }
      }
      districtCourt {
        items {
          id
          label
        }
      }
      supremeCourt {
        items {
          id
          label
        }
      }
      all {
        items {
          id
          label
        }
      }
    }
  }
`
