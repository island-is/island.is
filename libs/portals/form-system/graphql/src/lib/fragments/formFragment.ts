import { gql } from '@apollo/client'

// Dummy for now, need the backend up to see the structure
export const FormFragment = gql`
  fragment Form on Form {
    id
    name
    slug
    fields {
      id
      name
      type
      required
    }
  }
`
