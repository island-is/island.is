import gql from 'graphql-tag'

export const GET_DEILISTOFNA_INFORMATION_FOR_SHIP = gql`
  query GetDeilistofnaInformationForShip(
    $input: GetDeilistofnaInformationForShipInput!
  ) {
    getDeilistofnaInformationForShip(input: $input) {
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
