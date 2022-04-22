import { gql } from '@apollo/client'

export const GET_SINGLE_PROPERTY_QUERY = gql`
  query GetSingleRealEstateQuery($input: GetRealEstateInput!) {
    assetsDetail(input: $input) {
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
      land {
        landNumber
        landAppraisal
        useDisplay
        area
        areaUnit
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
`

export const GET_UNITS_OF_USE_QUERY = gql`
  query GetAssetsUnitsOfUse($input: GetPagingTypes!) {
    assetsUnitsOfUse(input: $input) {
      paging {
        page
        pageSize
        totalPages
        offset
        total
        hasPreviousPage
        hasNextPage
      }
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
`

export const GET_PROPERTY_OWNERS_QUERY = gql`
  query GetAssetsPropertyOwners($input: GetPagingTypes!) {
    assetsPropertyOwners(input: $input) {
      registeredOwners {
        name
        ssn
        ownership
        purchaseDate
        grantDisplay
      }
      paging {
        page
        pageSize
        totalPages
        offset
        total
        hasPreviousPage
        hasNextPage
      }
    }
  }
`
