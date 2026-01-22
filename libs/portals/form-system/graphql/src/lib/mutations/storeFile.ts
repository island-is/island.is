import { gql } from '@apollo/client'

export const STORE_FILE = gql`
  mutation StoreFormSystemFile($input: FormSystemStoreFileInput!) {
    storeFormSystemFile(input: $input)
  }
`
