import { gql } from '@apollo/client'

export const UPDATE_SECTION = gql`
  mutation FormSystemUpdateSection($input: FormSystemUpdateSectionInput!) {
    formSystemUpdateSection(input: $input)
  }
`
