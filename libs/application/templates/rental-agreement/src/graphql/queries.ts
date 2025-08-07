import { gql } from '@apollo/client'

export const ADDRESS_SEARCH_QUERY = gql`
  query AddressSearchQuery($input: HmsSearchInput!) {
    hmsSearch(input: $input) {
      addresses {
        address
        addressCode
        landCode
        municipalityCode
        municipalityName
        postalCode
        streetName
        streetNumber
        numOfConnectedProperties
      }
    }
  }
`

export const PROPERTY_INFO_QUERY = gql`
  query PropertyInfoQuery($input: HmsPropertyInfoInput!) {
    hmsPropertyInfo(input: $input) {
      propertyInfos {
        address
        addressCode
        landCode
        municipalityCode
        municipalityName
        postalCode
        propertyCode
        propertyLandValue
        propertyUsageDescription
        propertyValue
        size
        sizeUnit
        unitCode
        appraisalUnits {
          address
          addressCode
          propertyCode
          propertyLandValue
          propertyUsageDescription
          propertyValue
          unitCode
          units {
            address
            addressCode
            appraisalUnitCode
            fireInsuranceValuation
            propertyCode
            propertyUsageDescription
            propertyValue
            size
            sizeUnit
            unitCode
          }
        }
      }
    }
  }
`

export const PROPERTY_CODE_INFO_QUERY = gql`
  query PropertyCodeInfoQuery($input: HmsPropertyCodeInfoInput!) {
    hmsPropertyCodeInfo(input: $input) {
      address {
        address
        addressCode
        landCode
        municipalityCode
        municipalityName
        numOfConnectedProperties
        postalCode
        streetName
        streetNumber
      }
    }
  }
`
