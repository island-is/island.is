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
        judges {
          id
          name
          title
          isPresident
          placement
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
      }
    }
  }
`
