import { gql } from '@apollo/client'

export const DELETE_SECTION = gql`
  mutation FormSystemDeleteSection($input: FormSystemDeleteSectionInput!) {
    formSystemDeleteSection(input: $input)
  }
`
