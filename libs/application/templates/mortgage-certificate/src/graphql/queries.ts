export const SEARCH_REAL_ESTATE_QUERY = `
  query SearchRealEstateQuery($input: GetRealEstateInput!) {
    assetsDetail(input: $input) {
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

export const MY_REAL_ESTATES_QUERY = `
  query GetMyRealEstatesQuery($input: GetMultiPropertyInput!) {
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

/*export const MY_REAL_ESTATES_QUERY = `
  query GetMyRealEstatesQuery($input: GetMultiPropertyInput!) {
    assetsOverviewWithDetail(input: $input) {
      properties {
        propertyNumber
        defaultAddress {
          locationNumber
          postNumber
          municipality
          propertyNumber
          display
          displayShort
        }
        appraisal {
          activeAppraisal
          plannedAppraisal
          activeStructureAppraisal
          plannedStructureAppraisal
          activePlotAssessment
          plannedPlotAssessment
          activeYear
          plannedYear
        }
        registeredOwners {
          registeredOwners {
            name
            ssn
            ownership
            purchaseDate
            grantDisplay
          }
        }
        unitsOfUse {
          unitsOfUse {
            propertyNumber
            unitOfUseNumber
            marking
            usageDisplay
            displaySize
            buildYearDisplay
            fireAssessment
            explanation
            appraisal {
              activeAppraisal
              plannedAppraisal
              activeStructureAppraisal
              plannedStructureAppraisal
              activePlotAssessment
              plannedPlotAssessment
              activeYear
              plannedYear
            }
            address {
              locationNumber
              postNumber
              municipality
              propertyNumber
              display
              displayShort
            }
          }
        }
      }
    }
  }
`*/
