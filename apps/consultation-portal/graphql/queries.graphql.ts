import gql from 'graphql-tag'

export const GET_AUTH_URL = gql`
  query consultationPortalAuthenticationUrl {
    consultationPortalAuthenticationUrl
  }
`

export const POST_ADVICE = gql`
  mutation consultationPortalPostAdvice(
    $input: ConsultationPortalPostAdviceInput!
  ) {
    consultationPortalPostAdvice(input: $input)
  }
`
