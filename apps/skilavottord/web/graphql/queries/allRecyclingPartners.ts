import gql from 'graphql-tag'

export const GET_ALL_RECYCLING_PARTNERS = gql`
  query getAllRecyclingPartners {
    getAllRecyclingPartners {
      companyId
      companyName
      address
      postnumber
      city
      website
      phone
      active
      createdAt
      updatedAt
    }
  }
`
