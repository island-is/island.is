import { gql } from '@apollo/client'

export const QUALITY_SIGNATURE = gql`
  query HasQualitySignature {
    drivingLicenseQualitySignature {
      dataUri
    }
  }
`
