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
        allocatedCatchQuota
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

export const UPDATE_SHIP_STATUS_FOR_CALENDAR_YEAR = gql`
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

export const GET_QUOTA_TYPES_FOR_TIME_PERIOD = gql`
  query GetQuotaTypesForTimePeriod($input: GetQuotaTypesForTimePeriodInput!) {
    getQuotaTypesForTimePeriod(input: $input) {
      id
      name
    }
  }
`

export const GET_QUOTA_TYPES_FOR_CALENDAR_YEAR = gql`
  query GetQuotaTypesForCalendarYear(
    $input: GetQuotaTypesForCalendarYearInput!
  ) {
    getQuotaTypesForCalendarYear(input: $input) {
      id
      name
    }
  }
`
