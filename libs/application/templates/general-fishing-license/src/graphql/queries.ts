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
      fishingLicenseInfo {
        code
        name
      }
      answer
      reasons {
        description
        directions
      }
    }
  }
`

export const PAYMENT_STATUS = gql`
  query ApplicationPaymentStatus($applicationId: String!) {
    applicationPaymentStatus(applicationId: $applicationId) {
      fulfilled
    }
  }
`
