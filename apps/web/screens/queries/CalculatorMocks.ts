import gql from 'graphql-tag'

// TEMPORARY — see calculatorMocks in apps/api/src/api.graphql. Delete once
// the 'calculator' content type exists in Contentful and this PoC harness
// is no longer needed.
export const GET_CALCULATOR_MOCKS = gql`
  query GetCalculatorMocks {
    calculatorMocks {
      id
      title
      calculatorType
      configJson
      translationStrings
    }
  }
`
