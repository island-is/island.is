import { gql } from '@apollo/client'

export const QUALITY_PHOTO = gql`
  query HasQualityPhoto {
    qualityPhoto {
      success
      qualityPhoto
    }
  }
`
