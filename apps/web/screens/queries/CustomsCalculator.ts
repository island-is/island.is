import gql from 'graphql-tag'

export const GET_CUSTOMS_CALCULATOR_PRODUCT_CATEGORIES = gql`
  query CustomsCalculatorProductCategories {
    customsCalculatorProductCategories {
      categories {
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
