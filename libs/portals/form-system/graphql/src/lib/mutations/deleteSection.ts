import { gql } from '@apollo/client'

export const DELETE_SECTION = gql`
  mutation DeleteFormSystemSection($input: FormSystemDeleteSectionInput!) {
    deleteFormSystemSection(input: $input)
  }
`
