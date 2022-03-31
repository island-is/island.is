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
      fishingLicenses {
        code
        name
        chargeType
      }
    }
  }
`

export const queryFishingLicense = gql`
  query FishingLicenseQuery($registrationNumber: Float!) {
    fishingLicenses(registrationNumber: $registrationNumber) {
      fishingLicenseInfo {
        code
        name
        chargeType
      }
      answer
      reasons {
        description
        directions
      }
    }
  }
`
