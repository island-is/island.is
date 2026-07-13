import gql from 'graphql-tag'

export const GET_RSK_CALCULATOR_FIELDS = gql`
  query GetRskCalculatorFields($calculatorType: RskCalculatorType!) {
    rskCalculatorFields(calculatorType: $calculatorType) {
      key
      label
      kind
      required
      unit
      min
      max
      options {
        value
        label
      }
    }
  }
`

export const GET_RSK_CALCULATOR_CALCULATION = gql`
  query GetRskCalculatorCalculation(
    $calculatorType: RskCalculatorType!
    $input: [RskCalculatorInputValue!]!
  ) {
    rskCalculatorCalculation(calculatorType: $calculatorType, input: $input) {
      key
      label
      value
      unit
      group
      emphasis
    }
  }
`
