import gql from 'graphql-tag'

export const GET_SHIP_STATUS_FOR_TIME_PERIOD = gql`
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

export const UPDATE_SHIP_STATUS_FOR_TIME_PERIOD = gql`
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

export const UPDATE_SHIP_QUOTA_STATUS_FOR_TIME_PERIOD = gql`
  mutation UpdateShipQuotaStatusForTimePeriod(
    $input: UpdateShipQuotaStatusForTimePeriodInput!
  ) {
    updateShipQuotaStatusForTimePeriod(input: $input) {
      nextYearCatchQuota
      nextYearQuota
      nextYearFromQuota
      totalCatchQuota
      quotaShare
      id
      newStatus
      unused
      percentCatchQuotaFrom
      percentCatchQuotaTo
      excessCatch
      allocatedCatchQuota
    }
  }
`
