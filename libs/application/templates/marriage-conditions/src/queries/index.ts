import { gql } from '@apollo/client'

export const GET_SYSLUMENN_ELECTRONIC_ID_STATUS = gql`
  query GetSyslumennElectronicIDStatus($input: GetElectronicIDInput!) {
    getSyslumennElectronicIDStatus(input: $input)
  }
`
