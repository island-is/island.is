import gql from 'graphql-tag'
import { slices } from './fragments'

export const GET_SUPPORT_QNAS = gql`
  query GetSupportQNAs($input: GetSupportQNAsInput!) {
    getSupportQNAs(input: $input) {
      id
      question
      answer {
        ...AllSlices
      }
      slug
      organization {
        id
        title
        slug
      }
      category {
        title
        description
        slug
      }
      subCategory {
        title
        description
        slug
      }
    }
  }
  ${slices}
`
