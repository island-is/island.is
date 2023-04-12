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
        numberWithType
        expiryStatus
        expiresWithinNoticeTime
      }
      childPassports {
        childNationalId
        childName
        secondParent
        secondParentName
        passports {
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
        numberWithType
        expiryStatus
        expiresWithinNoticeTime
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
