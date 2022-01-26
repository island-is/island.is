import { gql } from '@apollo/client'

export const queryShips = `
  query ShipQuery {
    ships {
      name
      registrationNumber
      grossTons
      length
      homePort
      seaworthiness {
        validTo
      }
      deprivations {
        validFrom
        invalidFrom
        explanation
      }
      features
      fishingLicences
    }
  }
`

export const queryFishingLicense = gql`
  query FishingLicenseQuery($registrationNumber: Float!) {
    fishingLicenses(registrationNumber: $registrationNumber) {
      name
      answer
      reasons {
        description
        directions
      }
    }
  }
`
