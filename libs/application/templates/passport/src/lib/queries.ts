import { gql } from '@apollo/client'

export const getSyslumennDistrictCommissionersAgencies = `
  query getSyslumennDistrictCommissionersAgencies {
    getSyslumennDistrictCommissionersAgencies {
      name
      place
      address
      id
    }
  }
`

export const getPassport = `
      query getPassport {
        getPassport {
          userPassport {
            productionRequestID
            number
            type
            verboseType
            subType
            status
            issuingDate
            expirationDate
            displayFirstName
            displayLastName
            mrzFirstName
            mrzLastName
            sex
          }
          childPassports {
            nationalId
            name
            secondParent
            identityDocuments {
            productionRequestID
            number
            type
            verboseType
            subType
            status
            issuingDate
            expirationDate
            displayFirstName
            displayLastName
            mrzFirstName
            mrzLastName
            sex
            }
          }
        }
      }
    `

export const hasDisabilityLicense = `
  query hasDisabilityLicense {
    hasDisabilityLicense
  }
`
