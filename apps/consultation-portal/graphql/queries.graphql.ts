import gql from 'graphql-tag'

export const POST_ADVICE = gql`
  mutation consultationPortalPostAdvice(
    $input: ConsultationPortalPostAdviceInput!
  ) {
    consultationPortalPostAdvice(input: $input)
  }
`
