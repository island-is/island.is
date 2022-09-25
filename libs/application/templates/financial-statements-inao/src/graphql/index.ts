import { gql } from '@apollo/client'

const getAvailableElections = gql`
  query FinancialStatementsInaoElections {
    financialStatementsInaoElections {
      electionId
      name
      electionDate
    }
  }
`

export default getAvailableElections
