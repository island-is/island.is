import gql from 'graphql-tag'

export const GET_SHIP_STATUS_INFORMATION = gql`
  query GetShipStatusInformation($input: GetShipStatusInformationInput!) {
    getShipStatusInformation(input: $input) {
      shipInformation {
        id
        shipNumber
        name
        timePeriod
      }
      allowedCatchCategories {
        id
        name
        allocation
        specialAlloction
        betweenYears
        betweenShips
        allowedCatch
        catch
        status
        displacement
        newStatus
        nextYear
        excessCatch
        unused
        totalAllowedCatch
        rateOfShare
        nextYearQuota
        nextYearFromQuota
      }
    }
  }
`
