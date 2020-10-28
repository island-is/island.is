import gql from 'graphql-tag'

export const GET_ALL_ACTIVE_RECYCLING_PARTNERS = gql`
  query getAllActiveRecyclingPartners {
    getAllActiveRecyclingPartners {
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
