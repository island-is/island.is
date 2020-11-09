import gql from 'graphql-tag'

export const VEHICLES_BY_NATIONAL_ID = gql`
  query skilavottordVehicles($nationalId: String!) {
    skilavottordVehicles(nationalId: $nationalId) {
      permno
      vinNumber
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

export const ALL_DEREGISTERED_VEHICLES = gql`
  query skilavottordVehicles {
    skilavottordAllDeregisteredVehicles {
      vehicleId
      vehicleType
      vehicleColor
      newregDate
      createdAt
      updatedAt
      recyclingRequests {
        id
        vehicleId
        recyclingPartnerId
        recyclingParter {
          companyId
          companyName
          address
          postnumber
          city
          website
          phone
          active
          createdAt
          updatedAt
        }
        requestType
        nameOfRequestor
        createdAt
        updatedAt
      }
    }
  }
`

export const VEHICLE_TO_DEREGISTER = gql`
  query skilavottordVehicleReadyToDeregistered($permno: String!) {
    skilavottordVehicleReadyToDeregistered(permno: $permno) {
      vehicleId
      vehicleType
      newregDate
      recyclingRequests {
        nameOfRequestor
      }
    }
  }
`
