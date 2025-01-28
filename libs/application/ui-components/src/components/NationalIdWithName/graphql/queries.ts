export const IDENTITY_QUERY = `
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`

export const COMPANY_IDENTITY_QUERY = `
  query CompanyIdentityQuery($input: RskCompanyInfoInput!) {
    companyRegistryCompany(input: $input) {
      name
    }
  }
`
