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

export const GET_UPDATED_SHIP_STATUS_FOR_CALENDAR_YEAR = gql`
  mutation GetUpdatedShipStatusForCalendarYear(
    $input: GetUpdatedShipStatusForCalendarYearInput!
  ) {
    getUpdatedShipStatusForCalendarYear(input: $input) {
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
