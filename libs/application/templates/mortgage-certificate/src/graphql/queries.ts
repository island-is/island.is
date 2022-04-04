export const MY_PROPERTIES_QUERY = `
query GetMyPropertiesQuery($input: GetMultiPropertyInput!) {
  assetsOverviewWithDetail(input: $input) {
    properties {
      propertyNumber
        defaultAddress {
          display
        }
        unitsOfUse {
          unitsOfUse {
            marking
            displaySize
            buildYearDisplay
            explanation
          }
        }
      }
    }
  }
  `

export const SEARCH_PROPERTIES_QUERY = `
    query SearchPropertiesQuery($input: SearchForPropertyInput!) {
      searchForProperty(input: $input) {
        propertyNumber
        defaultAddress {
          display
        }
        unitsOfUse {
          unitsOfUse {
            marking
            displaySize
            buildYearDisplay
            explanation
          }
        }
      }
    }
  `

export const VALIDATE_MORTGAGE_CERTIFICATE_QUERY = `
    query ValidateMortgageCertificateQuery($input: ValidateMortgageCertificateInput!) {
      validateMortgageCertificate(input: $input) {
        propertyNumber
        isFromSearch
        exists
        hasKMarking
      }
    }
  `
