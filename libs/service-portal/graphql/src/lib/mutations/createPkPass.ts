import { gql } from '@apollo/client'

export const CREATE_PK_PASS = gql`
  mutation generatePkPass($input: GeneratePkPassInput!) {
    generatePkPass(input: $input) {
      pkpassUrl
      pkpassQRCode
    }
  }
`
