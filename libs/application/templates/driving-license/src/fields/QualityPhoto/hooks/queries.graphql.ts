import { gql } from '@apollo/client'

export const QUALITY_PHOTO = gql`
  query HasQualityPhoto {
    drivingLicenseQualityPhoto {
      dataUri
    }
  }
`

export const QUALITY_SIGNATURE = gql`
  query HasQualitySignature {
    drivingLicenseQualitySignature {
      dataUri
    }
  }
`
