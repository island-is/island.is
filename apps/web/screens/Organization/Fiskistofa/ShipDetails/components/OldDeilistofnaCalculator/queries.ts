import gql from 'graphql-tag'

export const GET_SHIP_STATUS_FOR_CALENDAR_YEAR = gql`
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
      catchQuotaCategories {
        id
        name
        allocation
        specialAlloction
        betweenYears
        betweenShips
        catchQuota
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
  mutation UpdateShipStatusForCalendarYear(
    $input: UpdateShipStatusForCalendarYearInput!
  ) {
    updateShipStatusForCalendarYear(input: $input) {
      shipInformation {
        id
        shipNumber
        name
        timePeriod
      }
      catchQuotaCategories {
        id
        name
        allocation
        specialAlloction
        betweenYears
        betweenShips
        catchQuota
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
