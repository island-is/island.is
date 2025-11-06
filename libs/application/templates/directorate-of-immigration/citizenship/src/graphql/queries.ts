export const IDENTITY_QUERY = `
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      givenName
      familyName
      name
      nationalId
    }
  }
`
