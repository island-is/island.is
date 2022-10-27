import gql from 'graphql-tag'

export const GET_SHIP_STATUS_FOR_TIME_PERIOD = gql`
  query FiskistofaGetShipStatusForTimePeriod(
    $input: FiskistofaGetShipStatusForTimePeriodInput!
  ) {
    fiskistofaGetShipStatusForTimePeriod(input: $input) {
      fiskistofaShipStatus {
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
  }
`

export const UPDATE_SHIP_STATUS_FOR_TIME_PERIOD = gql`
  query FiskistofaUpdateShipStatusForTimePeriod(
    $input: FiskistofaUpdateShipStatusForTimePeriodInput!
  ) {
    fiskistofaUpdateShipStatusForTimePeriod(input: $input) {
      fiskistofaShipStatus {
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
  }
`

export const UPDATE_SHIP_QUOTA_STATUS_FOR_TIME_PERIOD = gql`
  query FiskistofaUpdateShipQuotaStatusForTimePeriod(
    $input: FiskistofaUpdateShipQuotaStatusForTimePeriodInput!
  ) {
    fiskistofaUpdateShipQuotaStatusForTimePeriod(input: $input) {
      fiskistofaShipQuotaStatus {
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
  }
`

export const GET_SHIP_STATUS_FOR_CALENDAR_YEAR = gql`
  query FiskistofaGetShipStatusForCalendarYear(
    $input: FiskistofaGetShipStatusForCalendarYearInput!
  ) {
    fiskistofaGetShipStatusForCalendarYear(input: $input) {
      fiskistofaShipStatus {
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
  }
`

export const UPDATE_SHIP_STATUS_FOR_CALENDAR_YEAR = gql`
  query FiskistofaUpdateShipStatusForCalendarYear(
    $input: FiskistofaUpdateShipStatusForCalendarYearInput!
  ) {
    fiskistofaUpdateShipStatusForCalendarYear(input: $input) {
      fiskistofaShipStatus {
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
  }
`

export const GET_QUOTA_TYPES_FOR_TIME_PERIOD = gql`
  query FiskistofaGetQuotaTypesForTimePeriod(
    $input: FiskistofaGetQuotaTypesForTimePeriodInput!
  ) {
    fiskistofaGetQuotaTypesForTimePeriod(input: $input) {
      fiskistofaQuotaTypes {
        id
        name
        totalCatchQuota
        codEquivalent
      }
    }
  }
`

export const GET_QUOTA_TYPES_FOR_CALENDAR_YEAR = gql`
  query FiskistofaGetQuotaTypesForCalendarYear(
    $input: FiskistofaGetQuotaTypesForCalendarYearInput!
  ) {
    fiskistofaQuotaTypes {
      id
      name
      totalCatchQuota
      codEquivalent
    }
  }
`

export const GET_SINGLE_SHIP = gql`
  query FiskistofaGetSingleShip($input: FiskistofaGetSingleShipInput!) {
    fiskistofaGetSingleShip(input: $input) {
      fiskistofaSingleShip {
        shipNumber
        name
        ownerName
        ownerSsn
        operatorName
        operatorSsn
        operatingCategory
        grossTons
      }
    }
  }
`
