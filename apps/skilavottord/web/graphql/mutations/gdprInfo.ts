import gql from 'graphql-tag'

export const SET_GDPR_INFO = gql`
  mutation setGDPRInfo($gdprStatus: String!, $nationalId: String!) {
    setGDPRInfo(gdprStatus: $gdprStatus, nationalId: $nationalId)
  }
`
