import { gql } from '@apollo/client'

export const CREATE_PK_PASS = gql`
  mutation generatePkPass($input: GeneratePkPassInput!) {
    generatePkPass(input: $input) {
      pkpassUrl
    }
  }
`

export const CREATE_PK_PASS_QR_CODE = gql`
  mutation generatePkPassQrCode($input: GeneratePkPassInput!) {
    generatePkPassQrCode(input: $input) {
      pkpassQRCode
    }
  }
`
