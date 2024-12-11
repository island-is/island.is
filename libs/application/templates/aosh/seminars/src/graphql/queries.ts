export const IS_COMPANY_VALID = `
  query IsCompanyValid($nationalId: String!) {
    seminarsVerIsCompanyValid(nationalId: $nationalId) {
      nationalId
      mayPayWithAnAccount
    }
  }
`
