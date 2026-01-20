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
