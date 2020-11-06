import gql from 'graphql-tag'

export const VEHICLES_BY_NATIONAL_ID = gql`
  query skilavottordVehicles($nationalId: String!) {
    skilavottordVehicles(nationalId: $nationalId) {
      permno
      type
      color
      firstRegDate
      isRecyclable
      hasCoOwner
      status
    }
  }
`

export const VEHICLES_BY_PARTNER_ID = gql`
  query skilavottordRecyclingPartnerVehicles($partnerId: String!) {
    skilavottordRecyclingPartnerVehicles(partnerId: $partnerId) {
      nationalId
      personname
      vehicles {
        vehicleId
        vehicleType
        vehicleColor
        newregDate
        recyclingRequests {
          id
          vehicleId
          recyclingPartnerId
          requestType
          nameOfRequestor
          createdAt
          updatedAt
        }
      }
    }
  }
`
