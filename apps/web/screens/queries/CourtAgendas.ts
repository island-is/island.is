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
        lawyers {
          id
          name
          title
          placement
          side
        }
        court
      }
      total
      input {
        page
        dateFrom
        dateTo
        court
      }
    }
  }
`
