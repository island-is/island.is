import { gql } from '@apollo/client'

export const DELETE_FILE = gql`
  mutation DeleteFormSystemFile($input: FormSystemDeleteFileInput!) {
    deleteFormSystemFile(input: $input)
  }
`
