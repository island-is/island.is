import gql from 'graphql-tag'

export const GET_CUSTOMS_CALCULATOR_PRODUCT_CATEGORIES = gql`
  query CustomsCalculatorProductCategories {
    customsCalculatorProductCategories {
      bottomLevel {
        parentLabel
        tariffNumber
        label
        description
      }
      topLevel {
        parentLabel
        tariffNumber
        label
        description
        children {
          parentLabel
          tariffNumber
          label
          description
          children {
            parentLabel
            tariffNumber
            label
            description
            children {
              parentLabel
              tariffNumber
              label
              description
              children {
                parentLabel
                tariffNumber
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
