import gql from 'graphql-tag'

export const GET_RECYCLING_PARTNER_BY_ID = gql`
  query getRecyclingPartner($id: Float!) {
    getRecyclingPartner(id: $id) {
      id
      name
      address
      postNumber
      website
      phone
      active
    }
  }
`

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
