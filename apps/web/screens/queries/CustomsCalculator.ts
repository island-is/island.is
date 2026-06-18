import gql from 'graphql-tag'

export const GET_CUSTOMS_CALCULATOR_PRODUCT_CATEGORIES = gql`
  query CustomsCalculatorProductCategories {
    customsCalculatorProductCategories {
      bottomLevel {
        id
        parentLabels
        tariffNumber
        label
        description
      }
      topLevel {
        id
        label
        description
        children {
          id
          label
          description
          children {
            id
            label
            description
            children {
              id
              label
              description
              children {
                id
                label
                description
              }
            }
          }
        }
      }
    }
  }
`

export const GET_CUSTOMS_CALCULATOR_UNITS = gql`
  query CustomsCalculatorUnits($tariffNumber: String!) {
    customsCalculatorUnits(tariffNumber: $tariffNumber) {
      units
    }
  }
`

export const GET_CUSTOMS_CALCULATOR_CALCULATE = gql`
  query CustomsCalculatorCalculate($input: CustomsCalculatorCalculationInput!) {
    customsCalculatorCalculate(input: $input) {
      startAmount
      additionalAmount
      totalAmount
      charges {
        code
        description
        amount
        percentage
        unit
      }
    }
  }
`
