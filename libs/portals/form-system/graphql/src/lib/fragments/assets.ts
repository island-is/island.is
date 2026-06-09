import { gql } from '@apollo/client'

export const addressFragment = gql`
  fragment Address on PropertyLocation {
    locationNumber
    postNumber
    municipality
    propertyNumber
    display
    displayShort
  }
`

export const pagingFragment = gql`
  fragment Paging on PagingData {
    page
    pageSize
    totalPages
    offset
    total
    hasPreviousPage
    hasNextPage
  }
`
