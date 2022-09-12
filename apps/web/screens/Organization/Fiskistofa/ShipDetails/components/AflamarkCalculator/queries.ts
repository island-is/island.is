import gql from 'graphql-tag'

export const GET_AFLAMARK_INFORMATION_FOR_SHIP = gql`
  query GetShipStatusForTimePeriod($input: GetShipStatusForTimePeriodInput!) {
    getShipStatusForTimePeriod(input: $input) {
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

export const GET_UPDATED_SHIP_STATUS_FOR_TIME_PERIOD = gql`
  mutation GetUpdatedShipStatusForTimePeriod(
    $input: GetUpdatedShipStatusForTimePeriodInput!
  ) {
    getUpdatedShipStatusForTimePeriod(input: $input) {
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
      }
    }
  }
`
