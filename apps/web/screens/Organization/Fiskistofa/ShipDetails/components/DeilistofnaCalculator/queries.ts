import gql from 'graphql-tag'

export const GET_SHIP_STATUS_FOR_TIME_PERIOD = gql`
  query GetShipStatusForCalendarYear(
    $input: GetShipStatusForCalendarYearInput!
  ) {
    getShipStatusForCalendarYear(input: $input) {
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

// TODO: add mutation
