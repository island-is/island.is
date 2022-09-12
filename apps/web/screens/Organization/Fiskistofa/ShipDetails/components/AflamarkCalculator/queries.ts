import gql from 'graphql-tag'

export const GET_AFLAMARK_INFORMATION_FOR_SHIP = gql`
  query GetAflamarkInformationForShip(
    $input: GetAflamarkInformationForShipInput!
  ) {
    getAflamarkInformationForShip(input: $input) {
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

export const GET_UPDATED_AFLAMARK_INFORMATION_FOR_SHIP = gql`
  mutation GetUpdatedAflamarkInformationForShip(
    $input: GetUpdatedAflamarkInformationForShipInput!
  ) {
    getUpdatedAflamarkInformationForShip(input: $input) {
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
