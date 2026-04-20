export const GET_PROPERTIES_BY_PROPERTY_CODE_QUERY = `
    query GetPropertiesByPropertyCode($input: HmsPropertyByPropertyCodeInput!) {
        hmsPropertyByPropertyCode(input: $input)
    }
`
