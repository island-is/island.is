import gql from 'graphql-tag'

export const ALL_RECYCLING_PARTNERS = gql`
  query skilavottordAllRecyclingPartners {
    skilavottordAllRecyclingPartners {
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

export const ALL_ACTIVE_RECYCLING_PARTNERS = gql`
  query skilavottordAllActiveRecyclingPartners {
    skilavottordAllActiveRecyclingPartners {
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
