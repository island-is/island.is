import { gql } from '@apollo/client'
import { ApplicantFragment } from '../fragments/applicant'

export const CREATE_APPLICANT = gql`
  mutation FormSystemCreateApplicant($input: FormSystemCreateApplicantInput!) {
    formSystemCreateApplicant(input: $input) {
      ...Applicant
    }
  }
  ${ApplicantFragment}
`
