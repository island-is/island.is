import gql from 'graphql-tag'

export const GET_UMS_COST_OF_LIVING_CALCULATOR = gql`
  query CostOfLivingCalculator {
    costOfLivingCalculator {
      items {
        numberOf
        clothes
        medicalCost
        food
        otherServices
        transport
        communication
        total
        text
        hobby
      }
    }
  }
`
