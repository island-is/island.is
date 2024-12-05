export const IS_COMPANY_VALID = `
  query IsCompanyValid($nationalId: String!) {
    isCompanyValid(nationalId: $nationalId) {
      nationalId
      mayPayWithAnAccount
    }
  }
`
