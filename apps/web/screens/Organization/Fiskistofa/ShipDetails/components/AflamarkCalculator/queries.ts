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
        totalCatchQuota
        quotaShare
        nextYearQuota
        nextYearFromQuota
        percentNextYearQuota
        percentNextYearFromQuota
      }
    }
  }
`

export const GET_UPDATED_SHIP_STATUS_FOR_TIME_PERIOD = gql`
  mutation UpdateShipStatusForTimePeriod(
    $input: UpdateShipStatusForTimePeriodInput!
  ) {
    updateShipStatusForTimePeriod(input: $input) {
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
