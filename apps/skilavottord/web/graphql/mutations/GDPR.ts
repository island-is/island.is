import gql from 'graphql-tag'

export const CREATE_GDPR_INFO = gql`
  mutation createSkilavottordGdpr($gdprStatus: String!, $nationalId: String!) {
    createSkilavottordGdpr(gdprStatus: $gdprStatus, nationalId: $nationalId)
  }
`
