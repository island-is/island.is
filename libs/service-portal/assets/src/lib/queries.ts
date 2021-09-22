import { gql } from '@apollo/client'

export const GET_SINGLE_PROPERTY_QUERY = gql`
  query GetSingleRealEstateQuery($input: GetRealEstateInput!) {
    getRealEstateDetail(input: $input)
  }
`

export const GET_PROPERTY_OWNERS_QUERY = gql`
  query GetThinglystirEigendurQuery($input: GetPagingTypes!) {
    getThinglystirEigendur(input: $input) {
      data {
        nafn
        kennitala
        eignarhlutfall
        kaupdagur
        heimild
        display
        heimildBirting
      }
      paging {
        page
        pageSize
        totalPages
        offset
        total
        hasPreviousPage
        hasNextPage
      }
    }
  }
`
