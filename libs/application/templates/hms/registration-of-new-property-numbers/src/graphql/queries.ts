export const SEARCH_ALL_PROPERTIES_QUERY = `
    query SearchPropertiesQuery($input: SearchForPropertyInput!) {
      searchForAllProperties(input: $input) {
        propertyNumber
        propertyType
        realEstate {
          propertyNumber
          usage
          defaultAddress
        }
      }
    }
`

export const GET_PROPERTIES_BY_PROPERTY_CODE_QUERY = `
    query GetPropertiesByPropertyCode($input: HmsPropertyByPropertyCodeInput!) {
        hmsPropertyByPropertyCode(input: $input)
    }
`
