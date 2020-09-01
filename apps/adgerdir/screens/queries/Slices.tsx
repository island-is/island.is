import gql from 'graphql-tag'

export const GET_ADGERDIR_SLICES_QUERY = gql`
  fragment FeaturedNewsFields on AdgerdirFeaturedNewsSlice {
    __typename
    id
    title
  }
`
